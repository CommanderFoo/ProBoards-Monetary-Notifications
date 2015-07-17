$(function(){

	(function(){

		return {

			key: "monetary_notifications",
			plugin: null,
			settings: null,
			theme: 1,

			text: {

				donation: "donation",
				accepted: "accepted",
				rejected: "rejected",
				gift: "gift",
				received: "received",
				trade: "trade",
				request: "request"

			},

			init: function(){
				this.setup();

				if(this.plugin && typeof yootil != "undefined" && typeof yootil.notifications != "undefined"){
					var self = this;

					new yootil.notifications(this.key, this.settings.notification_template).show({

						// Parse messages.  We keep the msg stored as small as possible and expand it before showing

						before: function(notification){
							if(notification.m.match(/^\[D:([\d\,\.]+)\|(\d+)\|(.+?)\]$/)){
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);
								var amount = yootil.number_format(monetary.format(RegExp.$1, true));

								notification.m = "You have " + self.text.received + " a " + self.text.donation + " of " + monetary.settings.money_symbol + amount + " from <a href='/user/" + user_id + "'>" + name + "</a>.";
							} else if(notification.m.match(/^\[DA:(\d+)\|(.+?)\]$/)){
								var user_id = (~~ RegExp.$1);
								var name = yootil.html_encode(RegExp.$2, true);

								notification.m = "<a href='/user/" + user_id + "'>" + name + "</a> " + self.text.accepted + " your " + self.text.donation + ".";
							} else if(notification.m.match(/^\[T:(\d+)\|(\d+)\|(.+?)\]$/)){
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);

								notification.m = "You have " + self.text.received + " a " + ((RegExp.$1 == 0)? self.text.gift : (self.text.trade + " " + self.text.request)) + " from <a href='/user/" + user_id + "'>" + name + "</a>.";
							} else if(notification.m.match(/^\[TAR:(\d)\|(\d+)\|(.+?)\]$/)){
								var type = (RegExp.$1 == 1 || RegExp.$1 == 2)? self.text.gift : (self.text.trade + " " + self.text.request);
								var status = (RegExp.$1 >= 2)? self.text.accepted : self.text.rejected;
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);

								notification.m = "<a href='/user/" + user_id + "'>" + name + "</a> " + status + " your " + type + ".";
							} else {
								notification.m = yootil.html_encode(notification.m); // Just in case users inject messages.
							}

							return notification;
						}

					});
				}
			},


			setup: function(){
				this.plugin = pb.plugin.get(this.key);
				this.settings = (this.plugin && this.plugin.settings)? this.plugin.settings : false;

				if(typeof monetary.shop != "undefined"){
					this.text.donation = monetary.donation.settings.text.donation.toLowerCase();
					this.text.gift = monetary.shop.trade.settings.text.gift.toLowerCase();
					this.text.received = monetary.shop.trade.settings.text.received.toLowerCase();
					this.text.trade = monetary.shop.trade.settings.text.trade.toLowerCase();
					this.text.request = monetary.shop.trade.settings.text.request.toLowerCase();
				}
			}

		};

	})().init();

});