// ASCII Art Library - Simple Version (No Netlify Functions)

let isBookOpen = false;
let isSheetsView = false;

const SPREADSHEET_ID = '10x47W2_zHd-KVitg36R0K-Y8qjy9Za36b2t6wSRQFGU';
const sheetsUrl = "https://docs.google.com/spreadsheets/d/10x47W2_zHd-KVitg36R0K-Y8qjy9Za36b2t6wSRQFGU/edit";

const openBookContent = `                 __...--~~~~~-._   _.-~~~~~--...__
              //               \`V\`               \\\\ 
             //                 |                 \\\\ 
            //__...--~~~~~~-._  |  _.-~~~~~~--...__\\\\ 
           //__.....----~~~~._\\ | /_.~~~~----.....__\\\\
          ====================\\\\|//====================`;

const closedBookContent = `       _______
      /       /|
     /       / /
    /_______/ /
   (_______(/ `;

const books = document.querySelectorAll('.book-overlay');
const bookContent = document.getElementById('book-content');
const libraryContainer = document.querySelector('.library-container');
const originalLibraryContent = libraryContainer?.innerHTML;

async function fetchSheetsContent() {
    try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const csvText = await response.text();
        const lines = csvText.split('\n');
        const books = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());
            
            if (values[0]) {
                books.push({
                    fileName: values[0] || '',
                    fileType: values[1] || '',
                    viewLink: values[2] || '',
                    directLink: values[3] || '',
                    embedLink: values[4] || ''
                });
            }
        }

        return { books, total: books.length };
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function renderSheetsContent(data) {
    if (!data) {
        return '<div style="padding: 20px; text-align: center; font-family: monospace;">Failed to load. <a href="' + sheetsUrl + '" target="_blank">Open Google Sheets</a></div>';
    }

    const { books, total } = data;
    
    let html = `<div style="background: #fff; color: #000; font-family: monospace; font-size: 12px; height: 500px; overflow-y: auto; border: 1px solid #000; padding: 16px;">`;
    
    html += `<div style="border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 16px; font-size: 18px;">books (${total})</div>`;

    if (books?.length > 0) {
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px;">`;
        
        books.forEach((book) => {
            const name = book.fileName.replace(/\.pdf$/i, '').toLowerCase();
            const link = book.viewLink || book.directLink || book.embedLink;
            
            if (link) {
                html += `
                    <div style="background: #fff; border: 1px solid #000; cursor: pointer; height: 180px; display: flex; flex-direction: column;" 
                         onclick="window.open('${link}', '_blank')" 
                         onmouseover="this.style.background='#f8f8f8'"
                         onmouseout="this.style.background='#fff'">
                        
                        <div style="height: 100px; border: 1px solid #000; margin: 8px; display: flex; align-items: center; justify-content: center;">
                            <div style="width: 30px; height: 40px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold;">PDF</div>
                        </div>
                        
                        <div style="padding: 8px; flex: 1; display: flex; flex-direction: column;">
                            <div style="font-size: 10px; line-height: 1.2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${name}</div>
                            <div style="font-size: 8px; color: #666; margin-top: auto;">${book.fileType || 'pdf'}</div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    } else {
        html += `<div style="text-align: center; padding: 40px;">No books found</div>`;
    }

    html += `<div style="border-top: 1px solid #000; padding: 16px; text-align: center; margin-top: 16px;">
        <span style="cursor: pointer; text-decoration: underline;" onclick="showLibrary()">close</span>
    </div></div>`;
    
    return html;
}

async function showSheetsContent() {
    if (!libraryContainer) return;
    
    libraryContainer.innerHTML = `
        <div style="height: 500px; display: flex; align-items: center; justify-content: center; font-family: monospace; border: 1px solid #000; background: #fff;">
            <div style="text-align: center;">
                <div style="font-size: 16px; margin-bottom: 16px; animation: pulse 2s infinite;">Loading books...</div>
                <div style="font-size: 10px;">connecting to google sheets</div>
            </div>
        </div>
        <style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }</style>
    `;
    
    try {
        const data = await fetchSheetsContent();
        libraryContainer.innerHTML = renderSheetsContent(data);
        isSheetsView = true;
    } catch (error) {
        libraryContainer.innerHTML = `<div style="height: 400px; display: flex; align-items: center; justify-content: center; font-family: monospace; border: 1px solid #000;">
            <div style="text-align: center;">
                <div>Error loading books</div>
                <div style="margin: 10px;"><span style="cursor: pointer; text-decoration: underline;" onclick="location.reload()">reload</span></div>
                <a href="${sheetsUrl}" target="_blank">open google sheets</a>
            </div>
        </div>`;
    }
}

function showLibrary() {
    if (!libraryContainer || !originalLibraryContent) return;
    
    libraryContainer.innerHTML = originalLibraryContent;
    isSheetsView = false;
    
    const restoredBooks = document.querySelectorAll('.book-overlay');
    restoredBooks.forEach(book => {
        book.addEventListener('click', function() {
            if (!bookContent) return;
            bookContent.style.opacity = '0';
            setTimeout(() => {
                bookContent.textContent = openBookContent;
                bookContent.className = 'book-open';
                isBookOpen = true;
                bookContent.style.opacity = '1';
            }, 150);
        });
    });
}

window.showLibrary = showLibrary;

function initializeBookSystem() {
    if (!books || !bookContent) return;
    
    books.forEach(book => {
        book.addEventListener('click', function() {
            bookContent.style.opacity = '0';
            setTimeout(() => {
                if (!isBookOpen) {
                    bookContent.textContent = openBookContent;
                    bookContent.className = 'book-open';
                    isBookOpen = true;
                } else {
                    bookContent.textContent = closedBookContent;
                    bookContent.className = 'book-closed';
                    isBookOpen = false;
                }
                bookContent.style.opacity = '1';
            }, 150);
        });
    });

    bookContent.addEventListener('click', function() {
        if (isBookOpen) {
            if (!isSheetsView) {
                showSheetsContent();
            } else {
                showLibrary();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeBookSystem);
