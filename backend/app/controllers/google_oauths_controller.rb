class GoogleOauthsController < ApplicationController
  skip_before_action :authenticate_request

  def create

    frontend_url = ENV['CLIENT_NEXT_URL']
    user_info = request.env['omniauth.auth']
    google_user_id = user_info['uid']
    google_user_name = user_info['info']['name']
    google_user_email = user_info['info']['email']
    provider = user_info['provider']


    user_authentication = UserAuthentication.find_or_create_by(uid: google_user_id, provider: provider) do |user_auth|
      user = User.find_or_create_by(email: google_user_email) do |u|
        u.name = google_user_name
      end
      user_auth.user = user
    end

    jwt_token = Api::JsonWebToken.encode(user_id: user_authentication.user_id)

    redirect_to "#{frontend_url}/AuthorizedEditor?accesstoken=#{jwt_token}", allow_other_host: true
  end
end
