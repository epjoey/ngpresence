angular.module('app.directives', [])

  // presence directive
  .directive('ngPresence', ['presence', 'auth', function(presence, auth){

    // When list of users exceeds this number, hide excess user names behind tooltip
    var MAX_USERS_TO_RENDER = 3;

    return {

      restrict: "EA",
      template:

      " \
      <span class='small text-muted presence-label' ng-show='users.length'>Also here:</span> \
      <span class='users'> \
        <span ng-repeat='user in users|limitTo:maxUsersToRender' tooltip='{{ user.fullName }}' tooltip-placement='bottom' class='user'> \
          <img ng-src='{{ user.imageUrl }}' width='25' height='25' /> \
        </span> \
        <span class='user text-center text-muted small' ng-if='excessUsers.length' ng-bind=\"'+'+(excessUsers.length)\" tooltip-placement='bottom' tooltip-html-unsafe='{{ excessUsersStr }}'></span> \
      </span> \
      ",


      scope: {
        presenceChannelName: "@"
      },

      link: function(scope, el, attrs) {

        scope.maxUsersToRender = attrs.maxUsersToRender || MAX_USERS_TO_RENDER;
        scope.users = [];

        var channel = presence.subscribe(scope.presenceChannelName);

        var updateUsers = function() {

          // filter out current user
          scope.users = _.filter(channel.members, function(user) {
            return user.username != auth.currentUser.username;
          });

          // assign each a "full" name
          _.each(scope.users, function(user) {
            user.fullName = user.name + ' (' + user.username + ')';
          });

          // hide excessUsers behind a single tooltip
          scope.excessUsers = _.rest(scope.users, scope.maxUsersToRender);
          scope.excessUsersStr = _.pluck(scope.excessUsers, 'fullName').join('<br>');

          // update DOM
          scope.$digest();
        };

        presence.bindChannelEvent(channel, 'member_added', updateUsers);
        presence.bindChannelEvent(channel, 'member_removed', updateUsers);

        scope.$on("$destroy", function() {
          presence.unsubscribe(scope.presenceChannelName);
        });

      }
    };
  }]);