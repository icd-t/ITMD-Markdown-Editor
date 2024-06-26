// Handle info
const info = document.getElementById("infoModal");
const file = document.getElementById("fileModal");
const infoWrapper = document.querySelector("#infoModalWrapper");
const fileWrapper = document.querySelector("#fileModalWrapper");

function showInfo(){
    info.showModal()
}
function hideInfo(){
    info.close()
}

function showFile(){
    file.showModal()
}
function hideFile(){
    file.close()
}

info.addEventListener("click", (e) => {
    if(!infoWrapper.contains(e.target)){
        info.close()
    }
})
file.addEventListener("click", (e) => {
    if(!fileWrapper.contains(e.target)){
        file.close()
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
    const originalTokenizer = { ...marked.Lexer.prototype.tokenizer };
    marked.use({ tokenizer: { ...originalTokenizer, ...tokenizer } });

    const tokenizer2 = {
        fences(src) {
            const match1 = src.match(/^\::+([^\$\n]+?)\::+/);
            if (match1) {
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

    const originalTokenizer2 = { ...marked.Lexer.prototype.tokenizer };
    marked.use({ tokenizer: { ...originalTokenizer2, ...tokenizer2 } });

    const tokenizer3 = {
        fences(src) {
            const match1 = src.match(/^##([^#]+)##/);
            if (match1) {
                const code = match1[1].trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '&#10;');
                return {
                    type: 'html',
                    raw: match1[0],
                    text: `<div class="hashtag">${code}</div>`
                };
            }
            return false;
        }
    };
    
    // Extend marked tokenizer
    const originalTokenizer3 = { ...marked.Lexer.prototype.tokenizer };
    marked.use({ tokenizer: { ...originalTokenizer3, ...tokenizer3 } });

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

// Get the button:
let mybutton = document.getElementById("topButton");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


// Word and character Counter
const textField = document.getElementById("editor");
const wordCount = document.getElementById("wordCounter");
const charCount = document.getElementById("charCounter");


function countWords(){
    let text = textField.value;
    text = text.trim();
    const words = text.split(" ");

    wordCount.innerText = words.length;
    charCount.innerText = text.length;
}