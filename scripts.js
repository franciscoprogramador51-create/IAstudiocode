const API_KEY = "SUA_CHAVE_AQUI"; // Cole sua gsk_ aqui
const ENDPOINT = "https://api.groq.com";

const elements = {
    btn: document.getElementById('generate-btn'),
    prompt: document.getElementById('prompt'),
    code: document.getElementById('code-output'),
    preview: document.getElementById('resultado-visual'),
    copy: document.getElementById('copy-btn')
};

async function generate() {
    const query = elements.prompt.value.trim();
    if (!query) return;

    // UI Feedback
    elements.btn.querySelector('.btn-text').style.display = 'none';
    elements.btn.querySelector('.loader').style.display = 'block';
    elements.btn.disabled = true;

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "system",
                    content: "Você é um mestre em Front-end. Retorne APENAS o código HTML/CSS puro (com <style>). NUNCA use ```, crases ou explicações."
                }, {
                    role: "user",
                    content: query
                }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const rawCode = data.choices[0].message.content;
        // Limpeza extra de possíveis marcas de código markdown
        const cleanCode = rawCode.replace(/```html|```css|```/gi, '').trim();

        elements.code.textContent = cleanCode;
        elements.preview.srcdoc = cleanCode;

    } catch (err) {
        elements.code.textContent = "// Erro: " + err.message;
    } finally {
        elements.btn.querySelector('.btn-text').style.display = 'block';
        elements.btn.querySelector('.loader').style.display = 'none';
        elements.btn.disabled = false;
    }
}

elements.btn.addEventListener('click', generate);

elements.copy.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.code.textContent);
    elements.copy.innerText = "Copiado!";
    setTimeout(() => elements.copy.innerText = "Copiar", 2000);
});