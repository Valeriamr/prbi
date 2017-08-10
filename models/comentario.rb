class Comentario
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  field :audio, type: String

  belongs_to :texto
  belongs_to :aluno
end
