// Navbar on scroll
let scrollpos = window.scrollY
  const header = document.querySelector("nav")
  const header_height = header.offsetHeight

  const add_class_on_scroll = () => header.classList.add("nav-shadow")
  const remove_class_on_scroll = () => header.classList.remove("nav-shadow")

  window.addEventListener('scroll', function() { 
    scrollpos = window.scrollY;

    if (scrollpos >= header_height) { add_class_on_scroll() }
    else { remove_class_on_scroll() }
});

function generateLinks() {
    const townName = document.getElementById("townName").value;
    const townNameCapitalized = townName.charAt(0).toUpperCase() + townName.slice(1);
    const userKeywordsInput = document.getElementById("userKeywords").value;
    const userKeywords = userKeywordsInput.split('\n').map(keyword => keyword.trim());
    const domainName = document.getElementById("domainName").value;
    // const domain = 'https://www.jenjewell.ca/';    

    let linksHtml = '<div class="results-title"><h2>Related Articles</h2></div>';

    for (let i = 0; i < userKeywords.length; i++) {
        const currentUrl = `https://${domainName}/ontario/${townName}/${userKeywords[i].replace(/\s+/g, '-').toLowerCase()}-${townName}/`;
        linksHtml += `<div class="post-silo-container">`;
        linksHtml += `<div class="post-url"><h3>${userKeywords[i]} ${townNameCapitalized}</h3>`;
        linksHtml += `<p><a href="${currentUrl}">${currentUrl}</a></p>`;
        linksHtml += getUrlLengthStatus(currentUrl);
        linksHtml += `<button class="title-button" onclick="copyToClipboard('${userKeywords[i]} ${townNameCapitalized}')">Copy Title</button>`;
        linksHtml += `<button onclick="copyToClipboard('${currentUrl}')">Copy URL</button></div>`;        

        if (i === 0) {
            const nextUrl = `https://${domainName}/ontario/${townName}/${userKeywords[i + 1].replace(/\s+/g, '-').toLowerCase()}-${townName}/`;

            linksHtml += `<div class="post-silo-container silo-start"><p>Related Article: <a href="${nextUrl}">${userKeywords[i + 1]} ${townNameCapitalized}</a></p>`;
            
            linksHtml += `<button class="code-button" onclick="copySingleToClipboard('${nextUrl}')">Copy Code</button></div>`;
        } else if (i === userKeywords.length - 1) {
            const prevUrl = `https://${domainName}/ontario/${townName}/${userKeywords[i - 1].replace(/\s+/g, '-').toLowerCase()}-${townName}/`;
            linksHtml += `<div class="post-silo-container silo-finish"><p>Related Article: <a href="${prevUrl}">${userKeywords[i - 1]} ${townNameCapitalized}</a></p>`;
            
            linksHtml += `<button class="code-button" onclick="copySingleToClipboard('${prevUrl}')">Copy Code</button>`;
        } else {
            const prevUrl = `https://${domainName}/ontario/${townName}/${userKeywords[i - 1].replace(/\s+/g, '-').toLowerCase()}-${townName}/`;
            const nextUrl = `https://${domainName}/ontario/${townName}/${userKeywords[i + 1].replace(/\s+/g, '-').toLowerCase()}-${townName}/`;
            
            linksHtml += `
                <div class="silo-links">
                    <p>                        
                        Related Article: <a href="${prevUrl}">${userKeywords[i + 1]} ${townNameCapitalized}</a><br>
                        Related Article: <a href="${nextUrl}">${userKeywords[i - 1]} ${townNameCapitalized}</a>
                    </p>
                    <button class="code-button" onclick="copyPairToClipboard('${prevUrl}', '${nextUrl}')">Copy Code</button>
                </div></div>`;
        }
    }
    document.getElementById("linksContainer").innerHTML = linksHtml;
    showResultsItems();
}

function getUrlLengthStatus(url) {
    const length = url.length;
    let statusHtml = '<span class="url-status">';
    if (length <= 65) {
        statusHtml += '<span class="green-check">✓ Good URL Length</span>';
    } else if (length > 65 && length <= 74) {
        statusHtml += '<span class="yellow-dot">• URL Length a bit long</span>';
    } else {
        statusHtml += '<span class="red-x">✗ URL Length is too long</span>';
    }
    statusHtml += '</span>';
    return statusHtml;
}

function showResultsItems() {
    const links = document.getElementById( 'linksContainer' );
    const resultsConfirm = document.getElementById("resultsConfirm");

    if( window.getComputedStyle( links, resultsConfirm ).opacity === "0" ) {
        resultsConfirm.style.opacity = "1";
        links.style.opacity = "1";
    } else {
        resultsConfirm.style.opacity = ""; 
        links.style.opacity = ""; 
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    const copyConfirm = document.getElementById("copyConfirm");

    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    copyConfirm.textContent = 'Copied!';
    setTimeout(function(){
        copyConfirm.textContent = '';
    }, 3000);
    // alert("URL(s) copied to clipboard!");
}

function copySingleToClipboard(url) {
    const singleText = `Related Article: <a href="${url}">${url}</a>`;
    copyToClipboard(singleText);
}

function copyPairToClipboard(prevUrl, nextUrl) {
    const pairText = `Related Article: <a href="${nextUrl}">${nextUrl}</a>\nRelated Article: <a href="${prevUrl}">${prevUrl}</a>`;
    copyToClipboard(pairText);
}