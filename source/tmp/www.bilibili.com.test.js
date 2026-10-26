// 单元测试文件：www.bilibili.com.test.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// 模拟 DOM 环境
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
  clipboard: {
    writeText: jest.fn()
  }
};

document.querySelector = jest.fn();
document.querySelectorAll = jest.fn();

// 加载被测试代码
const scriptPath = path.join(__dirname, 'www.bilibili.com.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
eval(scriptContent);

describe('www.bilibili.com.js 单元测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('按钮创建和样式设置正确', () => {
    expect(copyVideoLinkButton).toBeDefined();
    expect(copyVideoLinkButton.id).toBe('copyVideoLinkButton');
    expect(copyVideoLinkButton.textContent).toBe('复制所有视频链接');
    expect(copyVideoLinkButton.style.marginLeft).toBe('12px');
    expect(copyVideoLinkButton.style.padding).toBe('4px 8px');
  });

  test('点击按钮时提取并过滤视频链接', () => {
    const mockLinks = [
      { href: 'https://www.bilibili.com/video/123' },
      { href: 'https://www.bilibili.com/video/456' },
      { href: 'https://example.com' }
    ];
    document.querySelectorAll.mockReturnValue(mockLinks);

    copyVideoLinkButton.click();

    expect(document.querySelectorAll).toHaveBeenCalledWith('a');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://www.bilibili.com/video/123\nhttps://www.bilibili.com/video/456'
    );
  });

  test('无视频链接时显示提示', () => {
    document.querySelectorAll.mockReturnValue([]);
    global.alert = jest.fn();

    copyVideoLinkButton.click();

    expect(alert).toHaveBeenCalledWith('未找到视频链接');
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  test('复制链接失败时显示错误', () => {
    const mockLinks = [{ href: 'https://www.bilibili.com/video/123' }];
    document.querySelectorAll.mockReturnValue(mockLinks);
    navigator.clipboard.writeText.mockRejectedValue(new Error('复制失败'));
    global.alert = jest.fn();

    copyVideoLinkButton.click();

    expect(alert).toHaveBeenCalledWith('复制失败：Error: 复制失败');
  });

  test('按钮成功添加到容器中', () => {
    const mockContainer = document.createElement('div');
    mockContainer.className = 'video-order-filter';
    document.querySelector.mockReturnValue(mockContainer);

    // 触发 DOMContentLoaded 事件
    window.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.querySelector).toHaveBeenCalledWith('.video-order-filter');
    expect(mockContainer.contains(copyVideoLinkButton)).toBe(true);
  });

  test('未找到容器时显示警告', () => {
    document.querySelector.mockReturnValue(null);
    global.console.warn = jest.fn();

    // 触发 DOMContentLoaded 事件
    window.dispatchEvent(new Event('DOMContentLoaded'));

    expect(console.warn).toHaveBeenCalledWith('未找到 .video-order-filter 元素');
  });
});