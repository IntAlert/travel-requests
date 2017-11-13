var express = require('express');
var office365Config = require('../config/office365');
var passport = require('passport');
var AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2').Strategy;
// var graph = require('../lib/o365/graph.js');
console.log(process.env.NODE_ENV);
module.exports = function(app) {

	// determine callback URL
	
	if(process.env.NODE_ENV == 'development') {
		var callbackURL = 'http://127.0.0.1:3000/api/auth/callback';
	} else {
		var callbackURL = 'http://travel-requests.intalert.org/api/auth/callback/';
	}

	passport.use(new AzureAdOAuth2Strategy({
	  clientID: office365Config.clientId,
	  clientSecret: office365Config.clientSecret,
	  authorizationURL: 'https://login.microsoftonline.com/common/oauth2/authorize',
	  callbackURL: callbackURL,
	  resource: 'https://graph.microsoft.com/',
	  tenant: office365Config.tenantId,
	},
	function (accessToken, refresh_token, params, profile, done) {


		res.status(200).json({
			accessToken, refresh_token, params, profile
		})
		// graph.getMyGroups(params.access_token)
		// 	.then(groups => {

		// 		var adminGroup = groups.find(function(group) {
		// 			return group.id == process.env.O365_ADMIN_GROUP_ID
		// 		})

		// 		var user = {
		// 			isAdmin: adminGroup != undefined,
		// 			isLoggedIn: true
		// 		}

		// 		done(null, user);
		// 	})

	}));

		
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});


	app.use(passport.initialize());  // for uauthentication/authorization
	app.use(passport.session());  

	// Standard login
	app.get('/api/auth/login', passport.authenticate('azure_ad_oauth2'));

	app.get('/api/auth/callback', 
	  passport.authenticate('azure_ad_oauth2', { failureRedirect: '/' }),
	    function (req, res) {
	      // Successful authentication, redirect home.
	      if (req.user.isAdmin) res.redirect('/admin');
	      else res.redirect('/users/dashboard');
	});

	app.get('/api/auth/logout', function(req, res){
		req.logOut();
		res.redirect('/');
	});

}
