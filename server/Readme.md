The process:
1. we are creating a access&refresh tokens when the user loges in, then we are sending the tokenback as response
2. created an auth middleware where we grab the accesstoken send from the headers, then we are jwt.verify() the token and send back the user to the req
3. sending req to "/refresh_token" route, its grabing the refresh token send from the body, checks if its and valid, and then send back a new access token
4. in the frontend we we'll continuesly make request to this refresh token route(folowing a specific action/time) and we'll have new access token, after a specific time/action we'll send req to "/refresh_token" route again and this will keep going on behind the scence,thats how we'll continously signin and signout the user behind the scence.

So its much more protected then regular jwt auth system.