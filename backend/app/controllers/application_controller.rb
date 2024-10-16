class ApplicationController < ActionController::API
  before_action :authenticate_request

  protected

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header.present?

    begin
      decoded = Api::JsonWebToken.decode(header)
      user_id = decoded[:user_id]

      @current_user = User.find(user_id)
      unless @current_user
        render json: { errors: 'User not found' }, status: :not_found
      end
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT Decode Error: #{e.message}"
      render json: { errors: 'Invalid token' }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "User Not Found Error: #{e.message}"
      render json: { errors: 'User not found' }, status: :not_found
    rescue => e
      Rails.logger.error "Authentication Error: #{e.message}"
      render json: { errors: 'Not Authorized' }, status: :unauthorized
    end
  end
end
