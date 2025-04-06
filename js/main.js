// js/main.js

/**
 * 配置常量
 * @constant {string} MD_ROOT - Markdown文件存储路径
 */
const MD_ROOT = './md/';

/**
 * 页面映射配置
 * @constant {Object} PAGE_MAP - 页面文件名与对应Markdown文件的映射
 */
const PAGE_MAP = {
  'index.html': 'home',
  'news.html': 'news',
  'tweets.html': 'tweets'
};

/**
 * 动态加载并渲染Markdown内容
 * @param {string} page - 当前页面标识符 (home/news/tweets)
 */
async function loadMarkdownContent(page) {
  const contentContainer = document.querySelector('.markdown-content');
  
  try {
    // 显示加载状态
    showLoadingState(contentContainer);

    // 发起网络请求获取Markdown文件
    const response = await fetch(`${MD_ROOT}${page}.md`);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }

    // 获取并解析文本内容
    const markdownText = await response.text();
    const htmlContent = marked.parse(markdownText);

    // 注入解析后的内容
    contentContainer.innerHTML = htmlContent;
    
    // 高亮代码块（需要已引入highlight.js）
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach(hljs.highlightElement);
    }
  } catch (error) {
    // 错误处理
    showErrorMessage(contentContainer, error);
  }
}

/**
 * 显示加载状态
 * @param {HTMLElement} container - 内容容器
 */
function showLoadingState(container) {
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>内容加载中...</p>
    </div>
  `;
}

/**
 * 显示错误信息
 * @param {HTMLElement} container - 内容容器
 * @param {Error} error - 错误对象
 */
function showErrorMessage(container, error) {
  console.error('内容加载失败:', error);
  container.innerHTML = `
    <div class="error-message">
      <h3>⚠️ 内容加载失败</h3>
      <p>错误信息: ${error.message}</p>
      <button onclick="location.reload()">重新加载</button>
    </div>
  `;
}

/**
 * 设置导航栏激活状态
 */
function setActiveNavigation() {
  // 获取当前页面文件名
  const currentPage = window.location.pathname.split('/').pop();
  
  // 遍历所有导航链接
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    const isActive = currentPage === linkPage;
    
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : null);
  });
}

/**
 * 初始化页面
 */
function initializePage() {
  // 设置导航状态
  setActiveNavigation();

  // 获取当前页面类型
  const currentPage = window.location.pathname.split('/').pop();
  const pageType = PAGE_MAP[currentPage];

  // 加载对应内容
  if (pageType) {
    loadMarkdownContent(pageType);
  }
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializePage);

// 窗口大小改变时优化移动端显示
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    document.querySelector('.navbar').style.flexDirection = 'row';
  } else {
    document.querySelector('.navbar').style.flexDirection = 'column';
  }
});
