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

let allUrls = [];

function generateLinks() {
    const townName = document.getElementById("townName").value;
    const userKeywordsInput = document.getElementById("userKeywords").value;
    const userKeywords = userKeywordsInput.split('\n').map(keyword => keyword.trim());
    const userAnchorsInput = document.getElementById("userAnchors").value;
    const userAnchors = userAnchorsInput.split('\n').map(anchor => anchor.trim());
    const targetAnchorsInput = document.getElementById("targetAnchors").value;
    const targetAnchors = targetAnchorsInput.split('\n').map(target => target.trim());
    const domainName = document.getElementById("domainName").value;

    let linksHtml = '<div class="results-title"><h2>Related Articles</h2></div>';
    allUrls = []; // Reset the URL array

    for (let i = 0; i < userKeywords.length; i++) {
        let currentUrl = `https://${domainName}${townName}/${userKeywords[i].replace(/\s+/g, '-').toLowerCase()}/`;
        let currentCopiedUrl = `${townName}/${userKeywords[i].replace(/\s+/g, '-').toLowerCase()}/`;
        
        // Remove unwanted characters from URL
        currentUrl = currentUrl.replace(/[?']/g, '');
        currentCopiedUrl = currentCopiedUrl.replace(/[?']/g, '');
        
        // Store URL in the array
        allUrls.push(currentUrl);
        
        linksHtml += `<div class="post-silo-container">`;
        linksHtml += `<h3>${userAnchors[i]}</h3>`;
        linksHtml += `<div class="post-url"><h4><span>Target Anchor</span>: ${targetAnchors[i]}</h4>`;
        linksHtml += `<p><a href="${currentUrl}">${currentUrl}</a></p>`;
        linksHtml += getUrlLengthStatus(currentUrl);
        linksHtml += `<div class="button-container"><button class="title-button" onclick="copyToClipboard('${userAnchors[i]}')">Copy Title</button>`;
        linksHtml += `<button class="target-button" onclick="copyToClipboard('${targetAnchors[i]}')">Copy Target</button>`;  
        linksHtml += `<button onclick="copyToClipboard('${currentCopiedUrl}')">Copy URL</button></div></div>`;               

        if (i === 0) {
            const nextUrl = `https://${domainName}${townName}/${userKeywords[i + 1].replace(/\s+/g, '-').toLowerCase()}/`.replace(/[?']/g, '');
            linksHtml += `<div class="post-silo-container silo-start"><p>Next Section: <a href="${nextUrl}">${userAnchors[i + 1]}</a></p>`;
            linksHtml += `<button class="code-button" onclick="copySingleToClipboard('${nextUrl}', '${userAnchors[i + 1]}', '${targetAnchors[i]}, ${townName}', '${domainName}')">Copy Code</button></div>`;
        } else if (i === userKeywords.length - 1) {
            const prevUrl = `https://${domainName}${townName}/${userKeywords[i - 1].replace(/\s+/g, '-').toLowerCase()}/`.replace(/[?']/g, '');
            linksHtml += `<div class="post-silo-container silo-finish"><p>Previous Section: <a href="${prevUrl}">${userAnchors[i - 1]}</a></p>`;
            linksHtml += `<button class="code-button" onclick="copySingleToClipboard('${prevUrl}', '${userAnchors[i - 1]}', '${targetAnchors[i]}, ${townName}', '${domainName}')">Copy Code</button>`;
        } else {
            const prevUrl = `https://${domainName}${townName}/${userKeywords[i - 1].replace(/\s+/g, '-').toLowerCase()}/`.replace(/[?']/g, '');
            const nextUrl = `https://${domainName}${townName}/${userKeywords[i + 1].replace(/\s+/g, '-').toLowerCase()}/`.replace(/[?']/g, '');
            linksHtml += `
                <div class="silo-links">
                    <p>
                        Next Section: <a href="${nextUrl}">${userAnchors[i + 1]} </a><br>
                        Previous Section: <a href="${prevUrl}">${userAnchors[i - 1]} </a>
                    </p>
                    <button class="code-button" onclick="copyPairToClipboard('${prevUrl}', '${nextUrl}', '${userAnchors[i - 1]}', '${userAnchors[i + 1]}', '${targetAnchors[i]}', '${domainName}')">Copy Code</button>
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
    const links = document.getElementById('linksContainer');
    const resultsConfirm = document.getElementById("resultsConfirm");

    if (window.getComputedStyle(links).opacity === "0") {
        resultsConfirm.style.opacity = "1";
        links.style.opacity = "1";
    } else {
        resultsConfirm.style.opacity = "0"; 
        links.style.opacity = "0"; 
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

    copyConfirm.style.display = 'block';
    setTimeout(function(){
        copyConfirm.style.display = 'none';
    }, 3000);
}

function copySingleToClipboard(url, userAnchors) {
    const singleText = `<h2 class="related-article--container">Related Article: <a href="${url}">${userAnchors}</a></h2>`;
    copyToClipboard(singleText);
}

function copyPairToClipboard(prevUrl, nextUrl, prevAnchor, nextAnchor) {
    const pairText = `<h2 class="related-article--container">Related Article: <a href="${nextUrl}">${nextAnchor}</a><br>\nRelated Article: <a href="${prevUrl}">${prevAnchor}</a></h2>`;
    copyToClipboard(pairText);
}

function copyAllUrls() {
    const allUrlsText = allUrls.join('\n');
    copyToClipboard(allUrlsText);
}



// function copySingleToClipboard(url, userAnchors, targetAnchors, domainName) {
//     const singleText = `<h2 class="related-article--container">Click here for more information on <a href="https://${domainName}/ontario/orangeville/orangeville-realtors/">${targetAnchors}</a><br>\nPlease visit this page to learn more about <a href="https://${domainName}/what-is-a-guarantor/">What is a Guarantor?</a><br>\n\nRelated Article: <a href="${url}">${userAnchors}</a></h2>`;
//     copyToClipboard(singleText);
// }

// function copyPairToClipboard(prevUrl, nextUrl, prevAnchor, nextAnchor, targetAnchors, domainName) {
//     const pairText = `<h2 class="related-article--container">Click here for more information on <a href="https://${domainName}/ontario/orangeville/orangeville-realtors/">${targetAnchors}</a><br>\nPlease visit this page to learn more about <a href="https://${domainName}/what-is-a-guarantor/">What is a Guarantor?</a><br>\nRelated Article: <a href="${nextUrl}">${nextAnchor}</a><br>\nRelated Article: <a href="${prevUrl}">${prevAnchor}</a></h2>`;
//     copyToClipboard(pairText);
// }

// ================ NO TARGET PAGE DELETE BELOW IF SG IS WORKING ======================
// function copySingleToClipboard(url, userAnchors) {
//     const singleText = `<h2 class="related-article--container">Related Article: <a href="${url}">${userAnchors}</a></h2>`;
//     copyToClipboard(singleText);
// }

// function copyPairToClipboard(prevUrl, nextUrl, prevAnchor, nextAnchor) {
//     const pairText = `<h2 class="related-article--container">Related Article: <a href="${nextUrl}">${nextAnchor}</a><br>\nRelated Article: <a href="${prevUrl}">${prevAnchor}</a></h2>`;
//     copyToClipboard(pairText);
// }