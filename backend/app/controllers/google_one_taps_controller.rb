class GoogleOneTapsController < ApplicationController
  skip_before_action :authenticate_request

  def callback
    begin
      # Google IDトークンを検証
      client_id = ENV['GOOGLE_CLIENT_ID']
      payload = Google::Auth::IDTokens.verify_oidc(params[:token], aud: client_id)

      # ここでユーザーの登録またはログイン処理を行う
      @user = User.find_or_create_by(email: payload['email']) do |user|
        user.name = payload['name']
      end
      UserAuthentication.find_or_create_by(uid: payload['sub'], provider: 'google_oauth2') do |auth|
        auth.user = @user
      end

      # JWTトークンを発行
      jwt_token = Api::JsonWebToken.encode(user_id: @user.id)
      response.set_header('Accesstoken', jwt_token)
      render json: { accesstoken: jwt_token, user: @user }, status: :ok
    rescue Google::Auth::IDTokens::SignatureError, Google::Auth::IDTokens::AudienceMismatchError => e
      # トークンの検証に失敗した場合の処理
      render json: { error: "Invalid ID token: #{e.message}" }, status: :unauthorized
    end
  end
end
