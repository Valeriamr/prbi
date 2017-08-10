class Novidade
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  field :titulo, type: String
  field :texto, type: String
  field :autor, type: String

end
