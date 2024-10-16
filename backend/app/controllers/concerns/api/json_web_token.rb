module Api::JsonWebToken
  extend self

  # ユーザー情報を元にJWTをエンコードするメソッド
  def encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end

  # JWTをデコードしてユーザー情報を取得するメソッド
  def decode(accesstoken)
    decoded = JWT.decode(accesstoken, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT Decode Error: #{e.message}"
    nil
  end
end
