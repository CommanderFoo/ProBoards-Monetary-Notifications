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

						before: function(notification){
							console.log(notification);

							return notification;
						},

						after: function(notification){
							console.log(notification);
						}

					});
				}
			},

			setup: function(){
				this.plugin = proboards.plugin.get(this.key);
				this.settings = (this.plugin && this.plugin.settings)? this.plugin.settings : false;
			},

		};

	})().init();

});