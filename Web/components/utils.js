angular.module('ACG.Client')
  .factory('apiKey', function ($window) {
    var url = 'http://127.0.0.1:3569/api/'; // local
    return url;
  })
  .provider('requestInterceptor', function () {
    /*
     At the moment, the api does not Accept requests with the same payload as it sends out.
     If we change that we can use set useMeta in a config function and the request interceptor will do it for us
     */
    this.useMeta = false;

    var transform = function (data, meta) {
      if (this.useMeta) {
        var payload = {
          data: data
        };

        if (meta) {
          payload.meta = meta;
        }
        return payload;
      }
      return data;
    };

    this.$get = ['apiKey', '$q', function (apiKey, $q) {
      var apiRegEx = new RegExp('^' + apiKey);

      return {
        request: function (request) {
          if (apiRegEx.test(request.url)) {
            request.data = transform(request.data);
          }
          return request;
        },
        response: function (response) {
          if (apiRegEx.test(response.config.url)) {
            var data = response.data.data;

            if (data && response.config.extractResponse) {
              if (data[response.config.extractResponse] === null) return null;
              var extractedData = data[response.config.extractResponse] || {};
              extractedData.meta = response.data.meta;
              return extractedData;
            }

            return response.data;
          }
          return response;
        },
        responseError: function (response) {
          var hasErrors = false;
          if (apiRegEx.test(response.config.url) && response.status !== 0) { // A response status of 0 is a failed response or an aborted request.
            hasErrors = !!(response.data && response.data.meta && response.data.meta.errors);
            console.error('api error : ', hasErrors ? response.data.meta.errors : 'did not find error array', response.config, response);
            // TODO: check response.status === 500 and alert the user?
          }
          return $q.reject(hasErrors ? response.data.meta.errors : response);
        }
      };
    }];
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('requestInterceptor');
  })

  .service('serviceUrl', function ($window, apiKey) {
    this.path = function (templateStr, obj) {
      obj = obj || {};
      obj.api = apiKey;
      return _.template(templateStr)(obj);
    };
  });