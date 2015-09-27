// a test suite (group of tests)
describe('ngpresence directive', function() {

  var scope, elem, presence, channel;

  var mockUser1 = {
    name: "Chet Faker",
    username: "chetthefaker"
  };

  var mockUser2 = {
    name: "Faker Baker",
    username: "baker"
  };


  beforeEach(function() {
    module('app');
    inject(function($compile, $rootScope, _presence_){

      presence = _presence_;
      scope = $rootScope.$new();

      scope.channelName = 'test-channel';
      var html = "<div ng-presence presence-channel-name='{{ channelName }}'></div>";
      elem = $compile(angular.element(html))(scope);
      channel = presence.subscribe(scope.channelName);

      scope.$digest();
    });
  });


  it('should have a label', function () {
    expect(elem.find('.presence-label').text()).toEqual('Also here:');
  });


  it('should have 2 users', function () {

    channel.members.push(mockUser1);
    channel.members.push(mockUser2);
    channel.trigger('member_added');

    expect(elem.find('.user').length).toBe(2);
  });


  it('should have 1 user', function () {

    channel.members.push(mockUser1);
    channel.members.push(mockUser2);
    channel.trigger('member_added');
    channel.members.pop();
    channel.trigger('member_removed');

    expect(elem.find('.user').length).toBe(1);
  });

});