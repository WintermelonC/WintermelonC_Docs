document.addEventListener('DOMContentLoaded', function() {
  var url = window.location.href;
  var customMessage = document.getElementById('custom-message');
  var errorTitle = document.getElementById('error-title');

  var cryptographyUrls = [
    'zju/module_courses/cryptography/doc1',
    'zju/module_courses/cryptography/doc2',
    'zju/module_courses/cryptography/doc3',
    'zju/module_courses/cryptography/doc4',
    'zju/module_courses/cryptography/doc5',
    'zju/module_courses/cryptography/doc6',
    'zju/module_courses/cryptography/doc7',
    'zju/module_courses/cryptography/doc8',
    'zju/module_courses/cryptography/doc9',
  ];

  var tempPrivateUrls = [];

  var isCryptographyUrl = cryptographyUrls.some(function(cryptographyUrls) {
    return url.includes(cryptographyUrls);
  });

  var isTempPrivateUrls = tempPrivateUrls.some(function(tempPrivateUrls) {
    return url.includes(tempPrivateUrls);
  });

  if (isCryptographyUrl) {
    customMessage.innerHTML = '<p>应课程老师要求，本文档内容不对外开放，敬请谅解</p>';
  } else if (isTempPrivateUrls) {
    customMessage.innerHTML = '<p>本文档内容暂时不对外开放，敬请谅解</p>';
  } else {
    customMessage.innerHTML = '<p>您尝试访问的页面不存在，请检查链接是否正确</p>';
  }
});