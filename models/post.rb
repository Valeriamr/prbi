class Post
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug


  field :title, type: String
  field :image, type: String
  field :date, type: String
  field :description, type: String
  field :video_url, type: String
  field :video_time, type: String


  validates_presence_of :title, :image, :date, :description


end