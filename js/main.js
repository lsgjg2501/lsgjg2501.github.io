// 初始化配置
const MD_ROOT = './md/';

// 动态加载Markdown
async function loadMarkdown(page) {
    try {
        const response = await fetch(`${MD_ROOT}${page}.md`);
        if (!response.ok) throw new Error('文件加载失败');
        const mdText = await response.text();
        const htmlContent = marked.parse(mdText);
        
        document.querySelector('.markdown-content').innerHTML = htmlContent;
    } catch (error) {
        document.querySelector('.markdown-content').innerHTML = `
            <div class="error-message">
                <h3>⚠️ 内容加载失败</h3>
                <p>错误信息：${error.message}</p>
            </div>
        `;
    }
}

// 自动设置导航激活状态
function setActiveNav() {
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-btn').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    
    // 根据页面类型加载对应内容
    const pageMap = {
        'index.html': 'home',
        'news.html': 'news',
        'tweets.html': 'tweets'
    };
    
    const currentPage = location.pathname.split('/').pop();
    if (pageMap[currentPage]) {
        loadMarkdown(pageMap[currentPage]);
    }
});