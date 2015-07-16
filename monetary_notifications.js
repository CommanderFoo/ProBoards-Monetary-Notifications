$(function(){

	(function(){

		return {

			key: "monetary_notifications",
			plugin: null,
			settings: null,
			theme: 1,

			init: function(){
				this.setup();

				if(this.plugin && typeof yootil != "undefined" && typeof yootil.notifications != "undefined"){
					new yootil.notifications(this.key, this.settings.notification_template).show({

						// Parse messages.  We keep the msg stored as small as possible and expand it before showing

						before: function(notification){
							if(notification.m.match(/^\[D:([\d\,]+)\|(\d+)\|(.+?)\]$/)){
								notification.m = "You have recevied a donation of " + monetary.settings.money_symbol + monetary.format(RegExp.$1) + " from <a href='/user/" + (~~ RegExp.$2) + "'>" + RegExp.$3 + "</a>.";
							} else if(notification.m.match(/^\[T:(\d+)\|(\d+)\|(.+?)\]$/)){
								notification.m = "You have recevied a " + ((RegExp.$1 == 0)? "gift" : "trade request") + " from <a href='/user/" + (~~ RegExp.$2) + "'>" + RegExp.$3 + "</a>.";
							} else if(notification.m.match(/^\[TAR:(\d)\|(\d+)\|(.+?)\]$/)){
								var type = (RegExp.$1 == 1 || RegExp.$1 == 2)? "gift" : "trade request";
								var status = (RegExp.$1 >= 2)? "accepted" : "rejected";

								notification.m = "<a href='/user/" + (~~ RegExp.$2) + "'>" + RegExp.$3 + "</a> " + status + " your " + type + ".";
							}

							return notification;
						}

					});
				}
			},

			setup: function(){
				this.plugin = pb.plugin.get(this.key);
				this.settings = (this.plugin && this.plugin.settings)? this.plugin.settings : false;
			},

		};

	})().init();

});