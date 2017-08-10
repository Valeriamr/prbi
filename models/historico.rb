class Historico
  include Mongoid::Document
  include Mongoid::Timestamps

  field :id_objeto_modificado, type: String
  field :tipo_objeto, type: String

  field :valor_anterior_annotator, type: String
  field :valor_novo_annotator, type: String
  field :quote_annotator, type: String

  field :nota1_nova_voto, type: Float
  field :nota2_nova_voto, type: Float
  field :nota3_nova_voto, type: Float
  field :nota4_nova_voto, type: Float
  field :nota5_nova_voto, type: Float
  field :comentario_novo_voto, type: String

  field :nota1_anterior_voto, type: Float
  field :nota2_anterior_voto, type: Float
  field :nota3_anterior_voto, type: Float
  field :nota4_anterior_voto, type: Float
  field :nota5_anterior_voto, type: Float
  field :comentario_anterior_voto, type: String

  field :pins_anterior_annotator, type: Array
  field :pins_novo_annotator, type: Array

  belongs_to :aluno

end