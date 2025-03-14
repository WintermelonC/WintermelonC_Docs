document.addEventListener('DOMContentLoaded', function() {
  var url = window.location.href;
  var customMessage = document.getElementById('custom-message');
  var errorTitle = document.getElementById('error-title');

  if (url.includes('/cryptography/')) {
    errorTitle.innerText = '本文档内容不对外开放，敬请谅解';
    customMessage.innerHTML = '<p>应课程老师要求，本文档内容不对外开放，敬请谅解</p>';
  } else {
    customMessage.innerHTML = '<p>您尝试访问的页面不存在，请检查链接是否正确</p>';
  }
});