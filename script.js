// Handle info
const info = document.getElementById("infoModal");
const wrapper = document.querySelector(".wrapper");
function showInfo(){
    info.showModal()
}
function hideInfo(){
    info.close()
}
info.addEventListener("click", (e) => {
    if(!wrapper.contains(e.target)){
        info.close()
    }
})

document.addEventListener("DOMContentLoaded", function() {
    const textarea = document.getElementById("editor");
    const div = document.getElementById("render");
    const downloadBtn = document.getElementById("export");
    const filenameTextarea = document.getElementById("name");
    const uploadBtn = document.getElementById("import");
    const fileInput = document.getElementById("fileInput");

    // Configure marked to use GitHub Flavored Markdown (GFM) and KaTeX for math rendering
    marked.setOptions({
        gfm: true,
        breaks: true,  // Enable line breaks
        tables: true,  // Enable table support
        renderer: new marked.Renderer(),
        math: true  // Enable KaTeX support
    });

    // Override the tokenizer to handle Mermaid code blocks enclosed in %%%
    const tokenizer = {
        fences(src) {
            const match1 = src.match(/^%%%([\s\S]+?)%%%/);
            if (match1) {
                // Preserve newlines by wrapping code in <pre> without escaping
                const code = match1[1].trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '&#10;');
                return {
                    type: 'html',
                    raw: match1[0],
                    text: `<pre class="mermaid">${code}</pre>`
                };
            }
            return false;
        }
    };

    // Extend marked tokenizer
    const originalTokenizer = { ...marked.Lexer.prototype.tokenizer };
    marked.use({ tokenizer: { ...originalTokenizer, ...tokenizer } });

    const tokenizer2 = {
        fences(src) {
            const match1 = src.match(/^\::+([^\$\n]+?)\::+/);
            if (match1) {
                // Preserve newlines by wrapping code in <pre> without escaping
                const code = match1[1].trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '&#10;');
                return {
                    type: 'html',
                    raw: match1[0],
                    text: `<i class="${code} fa-xl icon"></i>`
                };
            }
            return false;
        }
    };

    // Extend marked tokenizer
    const originalTokenizer2 = { ...marked.Lexer.prototype.tokenizer };
    marked.use({ tokenizer: { ...originalTokenizer2, ...tokenizer2 } });


    // Listen for input events on the main textarea
    textarea.addEventListener("input", function() {
        // Convert the textarea value to Markdown using marked
        const markdownContent = marked.parse(textarea.value);
        // Update the div content with the rendered Markdown
        div.innerHTML = markdownContent;
        // Render any KaTeX math expressions in the div
        renderMathInElement(div, {delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\[", right: "\\]", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\(", right: "\\)", display: false}
        ]});
        // Render Mermaid diagrams
        mermaid.init(undefined, div.querySelectorAll('.mermaid'));
    });

    // Listen for click events on the download button
    downloadBtn.addEventListener("click", function() {
        const filename = filenameTextarea.value.trim() || 'content';
        const blob = new Blob([textarea.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Listen for click events on the upload button
    uploadBtn.addEventListener("click", function() {
        fileInput.click();
    });

    // Listen for change events on the file input
    fileInput.addEventListener("change", function() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                textarea.value = e.target.result;
                // Update the div content with the rendered Markdown
                div.innerHTML = marked.parse(textarea.value);
                // Render any KaTeX math expressions in the div
                renderMathInElement(div, {delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "\\[", right: "\\]", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false}
                ]});
            };
            reader.readAsText(file);
        }
    });

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto'; // Reset height to auto
       textarea.style.height = `${textarea.scrollHeight}px`; // Set height to the scroll height of content
      });
});

function closeHandler(e) {
    e.preventDefault(); // Does not actually cancel
    e.returnValue = ''; // Does prevent dialog (doesn't show anyways)
    alert('You are about to close the editor. Make sure you have saved your file. Any unsaved text will be permanently deleted.'); // Does not display
    window.open(window.location.href, '_blank'); // Open a new tab?, No...
  }

  if (window.addEventListener) {
    window.addEventListener('beforeunload', closeHandler, true);
  } else if (window.attachEvent) {
    window.attachEvent('onbeforeunload', closeHandler);
  }