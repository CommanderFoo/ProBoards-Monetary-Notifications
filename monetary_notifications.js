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
				request: "request",
				wallet: "wallet",
				bank: "bank"

			},

			init: function(){
				this.setup();

				if(this.plugin && typeof yootil != "undefined" && typeof yootil.notifications != "undefined"){
					var self = this;

					new yootil.notifications(this.key, this.settings.notification_template).show({

						// Parse messages.  We keep the msg stored as small as possible and expand it before showing

						before: function(notification){

							// Donation received

							if(notification.m.match(/^\[D:([\d,\.]+)\|(\d+)\|(.+?)\]$/)){
								var amount = RegExp.$1;
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);

								notification.m = "You have " + self.text.received + " a " + self.text.donation + " of " + monetary.settings.money_symbol + yootil.number_format(monetary.format(amount, true)) + " from <a href='/user/" + user_id + "'>" + name + "</a>.";

							// Donation accepted.

							} else if(notification.m.match(/^\[DA:([\d,\.]+)\|(\d+)\|(.+?)\]$/)){
								var amount = RegExp.$1;
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);

								notification.m = "<a href='/user/" + user_id + "'>" + name + "</a> " + self.text.accepted + " your " + self.text.donation + " of " +  monetary.settings.money_symbol + yootil.number_format(monetary.format(amount, true)) + ".";

							// Trade request / gift received

							} else if(notification.m.match(/^\[T:(\d+)\|(\d+)\|(.+?)\]$/)){
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);

								notification.m = "You have " + self.text.received + " a " + ((RegExp.$1 == 0)? self.text.gift : (self.text.trade + " " + self.text.request)) + " from <a href='/user/" + user_id + "'>" + name + "</a>.";

							// Trade accetped / rejected

							} else if(notification.m.match(/^\[TAR:(\d)\|(\d+)\|(.+?)\]$/)){
								var type = (RegExp.$1 == 1 || RegExp.$1 == 2) ? self.text.gift : (self.text.trade + " " + self.text.request);
								var status = (RegExp.$1 >= 2) ? self.text.accepted : self.text.rejected;
								var user_id = (~~ RegExp.$2);
								var name = yootil.html_encode(RegExp.$3, true);

								notification.m = "<a href='/user/" + user_id + "'>" + name + "</a> " + status + " your " + type + ".";

							// Money / Bank edited

							} else if(notification.m.match(/^\[ME:(\d)\|([\d,\.]+)\|(\d)\|(\d+)\|(.+?)\]$/)){
								var user = "";
								var type = (RegExp.$1 == 2)? (self.text.bank + " account") : self.text.wallet;
								var new_money = RegExp.$2;
								var action_type = RegExp.$3;
								var user_id = (~~ RegExp.$4);
								var name = RegExp.$5;
								var msg = "Your " + type + " was ";

								if(monetary.settings.notification.show_edited){
									user = " by <a href='/user/" + user_id + "'>" + yootil.html_encode(name, true) + "</a>";
								}

								switch(~~ action_type){

									case 3:
										msg += "increased by ";
										break;

									case 4:
										msg += "decreased by ";
										break;

									case 1:
									case 2:
										msg += "set to ";
										break;
								}


								msg += "<strong>" + monetary.settings.money_symbol + yootil.number_format(monetary.format(new_money, true)) + "</strong>" + user + ".";

								notification.m = msg;
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
					this.text.wallet = monetary.settings.text.wallet.toLowerCase();
					this.text.bank = monetary.bank.settings.text.bank.toLowerCase();
				}
			}

		};

	})().init();

});