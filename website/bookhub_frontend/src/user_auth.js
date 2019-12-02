
var UserAuth = (function() {
    var username = '';
    var email = '';
    var auth = false;
  
    var setUsername = function(name){
        this.username = name;
    }
    var getUsername = function(){
        return this.username;
    }
  
    var setEmail = function(user_email){
        this.email = user_email;
    }
  
    var getEmail = function(){
        return this.email;
    }
  
    var setAuth = function(authenticate){
        this.auth = authenticate;
    }
        
    var getAuth = function(){
        if(this.auth === undefined){
            return false;
        }
        return this.auth;
    }

    return {
        setUsername: setUsername,
        getUsername: getUsername,
        setEmail: setEmail,
        getEmail: getEmail,
        setAuth: setAuth,
        getAuth: getAuth
      }

  })();

export default UserAuth;