Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:8888", '127.0.0.1:8888'
    resource "*",
      headers: :any,
      expose: ['Accesstoken', 'Authorization'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
