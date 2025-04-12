document.addEventListener("DOMContentLoaded", function () {


    //shown not shown part

    const listItems = document.querySelectorAll("div#main ul li");
    const contentDivs = {
        "Derivative": "derivative",
        "Integral": "integral",
        "Limit": "limit"
    };

    listItems.forEach(li => {
        li.addEventListener("click", () => {
            document.querySelectorAll("#mathpart > div").forEach(div => {
                div.classList.remove("shown");
            });

            const id = contentDivs[li.textContent.trim()];
            
            if (id) {
                document.getElementById(id).classList.add("shown");
            }
        });
    });


    // derivative

    const derivativeBtn = document.getElementById("differentiate");
    if (derivativeBtn) {
        derivativeBtn.addEventListener("click", function () {
            const rawInput = document.getElementById("functionInput").value.trim();
            try {
                const input = rawInput.replace(/(\d)([a-zA-Z])/g, '$1*$2');
                const node = math.parse(input);
                const derivative = math.derivative(node, 'x');
                const originalLatex = node.toTex({ parenthesis: 'keep' });
                const derivativeLatex = derivative.toTex({ parenthesis: 'keep' });

                let explanation = getDerivativeSteps(node);

                document.getElementById("derivativeSteps").innerHTML = `
                <div><b>Function:</b> $$${originalLatex}$$</div>
                <div><b>Derivative:</b> $$\\frac{d}{dx}\\left(${originalLatex}\\right) = ${derivativeLatex}$$</div>
                <div><b>Steps:</b><br>${explanation}</div>
            `;
                MathJax.typeset();
            } catch (error) {
                document.getElementById("derivativeSteps").innerHTML = "⚠️ Invalid function input.";
            }
        });
    }

    function getDerivativeSteps(node) {
        function recurse(node) {
            if (node.isSymbolNode && node.name === 'x') {
                return "The derivative of \\(x\\) is \\(1\\).";
            }
    
            if (node.isConstantNode) {
                return `The derivative of constant \\(${node.value}\\) is \\(0\\).`;
            }
    
            if (node.isOperatorNode) {
                const [left, right] = node.args;
    
                if (node.op === '+') {
                    const leftSteps = recurse(left);
                    const rightSteps = recurse(right);
                    return `
                        ${leftSteps}<br><br>
                        ${rightSteps}<br><br>
                        Combine the results using linearity of derivatives (sum rule).
                    `;
                }
    
                if (node.op === '^' && left.isSymbolNode && left.name === 'x') {
                    const n = right.value;
                    return `
                        Using the <i>power rule</i>:<br>
                        $$\\frac{d}{dx}(x^${n}) = ${n}x^{${n - 1}}$$
                    `;
                }
    
                if (node.op === '*' && (
                    (left.isConstantNode && right.isOperatorNode && right.op === '^' && right.args[0].isSymbolNode && right.args[0].name === 'x') ||
                    (right.isConstantNode && left.isOperatorNode && left.op === '^' && left.args[0].isSymbolNode && left.args[0].name === 'x')
                )) {
                    // Normalize order: constant * x^n
                    const constant = left.isConstantNode ? left.value : right.value;
                    const powerNode = left.isConstantNode ? right : left;
                    const n = powerNode.args[1].value;
    
                    return `
                        Term: $$${constant}x^${n}$$<br>
                        - Identify as constant times power of x.<br>
                        - Apply power rule: $$\\frac{d}{dx}(x^${n}) = ${n}x^{${n - 1}}$$<br>
                        - Multiply by constant ${constant}: $$${constant} \\cdot ${n}x^{${n - 1}} = ${constant * n}x^{${n - 1}}$$
                    `;
                }
    
                if (node.op === '*' && left.isConstantNode && right.isSymbolNode && right.name === 'x') {
                    return `
                        Term: $$${left.value}x$$<br>
                        - Recognize as constant times \\(x\\).<br>
                        - Derivative of \\(x\\) is \\(1\\).<br>
                        - Multiply: \\(${left.value} \\cdot 1 = ${left.value}\\)
                    `;
                }
    
                if (node.op === '*' && right.isConstantNode && left.isSymbolNode && left.name === 'x') {
                    return `
                        Term: $$x \\cdot ${right.value}$$<br>
                        - Recognize as \\(x\\) times constant.<br>
                        - Derivative of \\(x\\) is \\(1\\).<br>
                        - Multiply: \\(1 \\cdot ${right.value} = ${right.value}\\)
                    `;
                }
    
                if (node.op === '*') {
                    // Apply the product rule: d/dx(u * v) = u' * v + u * v'
                    return `
                        Using the <i>product rule</i>:<br>
                        $$\\frac{d}{dx}(u \\cdot v) = u'v + uv'$$<br>
                        - Differentiate the first function, \\(u'\\), and leave the second function, \\(v\\), as is.<br>
                        - Differentiate the second function, \\(v'\\), and leave the first function, \\(u\\), as is.<br>
                        - Combine the results by adding them together: \\(u'v + uv'\\).<br>
                        <b>For example:</b><br>
                        - If \\(u = x^2\\) and \\(v = 3x\\), the derivative of \\(u = 2x\\) and the derivative of \\(v = 3\\).<br>
                        - Applying the product rule: \\( (2x)(3x) + (x^2)(3) = 6x^2 + 3x^2 = 9x^2 \\).
                    `;
                }
            }
    
            return "⚠️ Step-by-step explanation for this term is not available yet.";
        }
    
        return recurse(node);
    }

    // --- Integral Calculation (Symbolic Approximation) ---
    const integrateBtn = document.getElementById("integrate");
    if (integrateBtn) {
        integrateBtn.addEventListener("click", function () {
            const rawInput = document.getElementById("integralInput").value.trim();

            try {
                const input = rawInput.replace(/(\d)([a-zA-Z])/g, '$1*$2');
                const node = math.parse(input);
                const texInput = node.toTex({ parenthesis: 'keep' });

                let texResult;

                switch (input) {
                    case "x":
                        texResult = "\\frac{1}{2}x^2 + C";
                        break;
                    case "x^2":
                        texResult = "\\frac{1}{3}x^3 + C";
                        break;
                    case "sin(x)":
                        texResult = "-\\cos(x) + C";
                        break;
                    case "cos(x)":
                        texResult = "\\sin(x) + C";
                        break;
                    case "e^x":
                        texResult = "e^x + C";
                        break;
                    default:
                        document.getElementById("integralSteps").innerHTML =
                            "⚠️ This version only supports basic functions like x, x^2, sin(x), cos(x), e^x.";
                        return;
                }

                document.getElementById("integralSteps").innerHTML =
                    `<div><b>Function:</b> $$${texInput}$$</div>
                     <div><b>Integral:</b> $$\\int ${texInput}\\, dx = ${texResult}$$</div>`;
                MathJax.typeset();
            } catch (err) {
                document.getElementById("integralSteps").innerHTML = "⚠️ Invalid function input.";
            }
        });
    }

    
    const calclimitBtn = document.getElementById("calclimit");
    if (calclimitBtn) {
        calclimitBtn.addEventListener("click", calculateLimit);
    }

    function calculateLimit() {
        const exprInput = document.getElementById("limitExpr").value.trim();
        const pointInput = document.getElementById("limitPoint").value.trim();
        const resultEl = document.getElementById("limitResult");

        try {
            const limitExpr = nerdamer(`limit(${exprInput}, x, ${pointInput})`);
            const result = limitExpr.toTeX();

            // Pretty LaTeX output
            resultEl.innerHTML = `
            <div><b>Function:</b> $$\\lim_{x \\to ${pointInput}} ${nerdamer(exprInput).toTeX()}$$</div>
            <div><b>Limit:</b> $$\\lim_{x \\to ${pointInput}} ${nerdamer(exprInput).toTeX()} = ${result}$$</div>
        `;
            MathJax.typesetPromise();
        } catch (error) {
            resultEl.innerHTML = '⚠️ Invalid expression or limit';
        }
    }


});