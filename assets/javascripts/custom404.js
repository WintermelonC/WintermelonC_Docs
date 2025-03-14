document.addEventListener('DOMContentLoaded', function() {
  var url = window.location.href;
  var customMessage = document.getElementById('custom-message');
  var errorTitle = document.getElementById('error-title');

  var privateUrls = [
    '/zju/module_courses/cryptography/ch1.md',
    '/zju/module_courses/cryptography/ch2.md',
    '/zju/module_courses/cryptography/ch3.md',
  ];

  var isPrivateUrl = privateUrls.some(function(privateUrl) {
    return url.includes(privateUrl);
  });

  if (isPrivateUrl) {
    errorTitle.innerText = '本文档内容不对外开放，敬请谅解';
    customMessage.innerHTML = '<p>应课程老师要求，本文档内容不对外开放，敬请谅解</p>';
  } else {
    customMessage.innerHTML = '<p>您尝试访问的页面不存在，请检查链接是否正确</p>';
  }
});