module.exports = (function () {

    config = {};
    function url_format(protocol, domain, port){
      return protocol + "://"  + domain + ":" + port;
    }
    function http(domain, port){
      return url_format('http', domain, port)
    }
    function grpc(domain, port){
      return url_format('grpc', domain, port)
    }
    var flag = true;
    if(flag){
          // local vm env
        config =  {
          ca_nodes     : [ http('192.168.99.20', '7054') ],
          peer_nodes     :  [ grpc('192.168.99.20', '7051') ],
          orderer_nodes : [ grpc('192.168.99.20', '7050') ],
          event_nodes : [ grpc('192.168.99.20', '7053') ],
        }
    }else{
        // local env
        config =  {
          ca_nodes     : [ http('localhost', '7054') ],
          peer_nodes     :  [ grpc('localhost', '7051') ],
          orderer_nodes : [ grpc('localhost', '7050') ],
          event_nodes : [ grpc('localhost', '7053') ],
        }
    }

    return config;
  })();