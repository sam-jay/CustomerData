
exports.respond = function(code, res, msg) {
  switch (code) {
    case 400:
      return res.json(400, {
        code: 'InvalidParameter',
        message: msg 
      });
      break;
    case 401:
      return res.json(401, {
        code: 'AuthenticationFailure',
        message: msg
      });
      break;
    case 403:
      return res.json(403, {
        code: 'PermissionDenied',
        message: msg
      });
      break;
    case 404:
      return res.json(404, {
        code: 'ResourceNotFound',
        message: msg + ' does not exist'
      });
      break;
    case 405:
      return res.json(405, {
        code: 'InvalidRequestMethod',
        message: msg
      });
      break;
    case 500:
      return res.json(500, {
        code: 'InternalServerError',
        message: msg
      });
      break;
    case 503:
      return res.json(503, {
        code: 'ServiceUnavailable',
        message: msg
      });
      break;
  }
}
