document.addEventListener('DOMContentLoaded', function() {
  var url = window.location.href;
  var customMessage = document.getElementById('custom-message');
  var errorTitle = document.getElementById('error-title');

  var privateUrls = [
    'zju/module_courses/cryptography/ch1',
    'zju/module_courses/cryptography/ch2',
    'zju/module_courses/cryptography/ch3',
    'zju/module_courses/cryptography/ch4',
    'zju/module_courses/cryptography/ch5',
    'zju/module_courses/cryptography/ch6',
    'zju/module_courses/cryptography/ch7',
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