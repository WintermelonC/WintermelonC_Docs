document.addEventListener('DOMContentLoaded', function() {
  var url = window.location.href;
  var customMessage = document.getElementById('custom-message');
  var errorTitle = document.getElementById('error-title');

  var cryptographyUrls = [
    'zju/module_courses/cryptography/ch1',
    'zju/module_courses/cryptography/ch2',
    'zju/module_courses/cryptography/ch3',
    'zju/module_courses/cryptography/ch4',
    'zju/module_courses/cryptography/ch5',
    'zju/module_courses/cryptography/ch6',
    'zju/module_courses/cryptography/ch7',
  ];

  var tempPrivateUrls = [
    'zju/module_courses/cryptography/doc/doc1',
    'zju/module_courses/cryptography/doc/doc2',
    'zju/module_courses/cryptography/doc/doc3',
    'zju/module_courses/cryptography/doc/doc4',
    'zju/module_courses/cryptography/doc/doc5',
    'zju/module_courses/cryptography/doc/doc6',
    'zju/module_courses/cryptography/doc/doc7',
    'zju/module_courses/cryptography/doc/doc8',
    'zju/module_courses/cryptography/doc/doc9',
  ];

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