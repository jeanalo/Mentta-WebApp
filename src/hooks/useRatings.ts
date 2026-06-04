export interface Review {
  author: string
  rating: number
  comment: string
  date: string
}

export const CAFETERIA_RATINGS: Record<string, number> = {
  'isabella': 4.6,
  'cafe-del-sol': 4.5,
  'wonka': 4.5,
  'qbano': 4.7,
  'anthonys-chef': 4.2,
  'bristo-central': 4.1,
  'bristo-g': 4.0,
  'cafe-sabor': 4.3,
  'cafe-quindio': 4.4,
  'the-snack-f': 4.1,
  'the-snack-bienest': 3.9,
  'ventolini': 4.3,
}

function hashId(id: string): number {
  let h = 5381
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) + h) ^ id.charCodeAt(i)
    h = h & 0xffff
  }
  return Math.abs(h)
}

export function getProductRating(id: string, popular: boolean): number {
  const h = hashId(id)
  if (popular) return Math.round((4.3 + (h % 7) * 0.1) * 10) / 10
  return Math.round((3.5 + (h % 12) * 0.1) * 10) / 10
}

export function getCafeteriaRating(id: string): number {
  return CAFETERIA_RATINGS[id] ?? 4.0
}

const REVIEWS: Record<string, Review[]> = {
  'isa-001': [
    { author: 'Valentina Ríos', rating: 5, comment: 'El pollo estaba muy bien condimentado y la porción generosa.', date: '14 may 2026' },
    { author: 'Santiago Mora', rating: 4, comment: 'Muy buena opción, el arroz siempre en su punto.', date: '9 may 2026' },
  ],
  'isa-002': [
    { author: 'Camila Torres', rating: 4, comment: 'El filete de cerdo estaba jugoso, buen precio.', date: '11 may 2026' },
  ],
  'isa-003': [
    { author: 'Andrés Peña', rating: 5, comment: 'La carne molida con frijoles es mi favorita acá.', date: '6 may 2026' },
    { author: 'Laura Castillo', rating: 4, comment: 'Siempre lo pido, nunca defrauda.', date: '3 may 2026' },
  ],
  'isa-007': [
    { author: 'Felipe Vargas', rating: 5, comment: 'El jugo natural está muy fresco, lo recomiendo.', date: '15 may 2026' },
  ],
  'ant-001': [
    { author: 'María González', rating: 5, comment: 'El pollo asado estaba excelente, la mejor bandeja del campus.', date: '13 may 2026' },
    { author: 'Sebastián López', rating: 4, comment: 'Buena porción y muy sabroso, el maduro estaba perfecto.', date: '7 may 2026' },
  ],
  'ant-002': [
    { author: 'Juliana Herrera', rating: 5, comment: 'La carne desmechada estaba blandita y bien sazonada.', date: '10 may 2026' },
    { author: 'Daniel Ramírez', rating: 4, comment: 'Muy rico, los frijoles estaban cremosos.', date: '4 may 2026' },
  ],
  'ant-006': [
    { author: 'Carolina Díaz', rating: 5, comment: 'El jugo en leche es delicioso, siempre lo pido.', date: '12 may 2026' },
  ],
  'brc-001': [
    { author: 'Miguel Sánchez', rating: 5, comment: 'El almuerzo con pollo siempre está fresco y bien preparado.', date: '16 may 2026' },
    { author: 'Natalia Ruiz', rating: 4, comment: 'Buena porción, las papas estaban crujientes.', date: '8 may 2026' },
  ],
  'brc-004': [
    { author: 'David Ospina', rating: 5, comment: 'El bowl de pollo es increíble, el aguacate siempre fresco.', date: '14 may 2026' },
    { author: 'Mariana Cano', rating: 4, comment: 'Muy completo y nutritivo, lo pido casi todos los días.', date: '5 may 2026' },
  ],
  'brc-006': [
    { author: 'Tomás Agudelo', rating: 5, comment: 'Los dedos de queso están perfectos, crujientes y suaves por dentro.', date: '11 may 2026' },
  ],
  'brc-007': [
    { author: 'Paula Martínez', rating: 5, comment: 'La salchipapa es la mejor del campus, las salsas son deliciosas.', date: '9 may 2026' },
    { author: 'Alejandro Cruz', rating: 4, comment: 'Buena cantidad para el precio, siempre la pido en la media mañana.', date: '2 may 2026' },
  ],
  'brg-001': [
    { author: 'Sofía Restrepo', rating: 4, comment: 'Buen almuerzo, el pollo estaba bien cocido.', date: '13 may 2026' },
  ],
  'brg-004': [
    { author: 'Nicolás Jiménez', rating: 5, comment: 'El bowl de pollo del Bristo G es excelente, muy fresco.', date: '7 may 2026' },
  ],
  'sol-001': [
    { author: 'Manuela Arango', rating: 5, comment: 'La Tremenda Burger es la mejor del campus, no cambiaría nada.', date: '15 may 2026' },
    { author: 'Juan Salazar', rating: 4, comment: 'Muy buena hamburguesa, la tocineta le da el toque perfecto.', date: '10 may 2026' },
  ],
  'sol-004': [
    { author: 'Daniela Mejía', rating: 5, comment: 'El arroz al wok con pollo está delicioso, el maduro le queda perfecto.', date: '14 may 2026' },
    { author: 'Esteban Naranjo', rating: 4, comment: 'Muy rico y la bebida incluida es un plus excelente.', date: '6 may 2026' },
  ],
  'sol-006': [
    { author: 'Isabella Parra', rating: 5, comment: 'El Azteca Bowl es mi favorito, me encanta el pico de gallo.', date: '12 may 2026' },
    { author: 'Camilo Hoyos', rating: 4, comment: 'Muy completo y sabroso, el precio es justo.', date: '3 may 2026' },
  ],
  'sol-008': [
    { author: 'Valeria Montoya', rating: 4, comment: 'El wrap de pollo con maduro es una combinación muy rica.', date: '11 may 2026' },
  ],
  'sol-010': [
    { author: 'Mateo Álvarez', rating: 5, comment: 'El Chicken & Chips está brutal, el pollo muy crujiente.', date: '16 may 2026' },
    { author: 'Sara Vélez', rating: 4, comment: 'Muy bueno, las papas fritas estaban en su punto.', date: '8 may 2026' },
  ],
  'sol-011': [
    { author: 'Andrés Orozco', rating: 4, comment: 'Las papitas son buenas y las salsas están muy ricas.', date: '9 may 2026' },
  ],
  'sol-015': [
    { author: 'Luisa Cardona', rating: 5, comment: 'El brownie con helado es el mejor postre que han tenido acá.', date: '13 may 2026' },
    { author: 'Felipe Ríos', rating: 5, comment: 'Increíble, el brownie caliente con el helado frío es perfecto.', date: '5 may 2026' },
  ],
  'sab-001': [
    { author: 'Natalia Gutiérrez', rating: 5, comment: 'El cappuccino es de los mejores del campus, la espuma perfecta.', date: '15 may 2026' },
    { author: 'David Zapata', rating: 4, comment: 'Muy buen café, consistente y bien preparado.', date: '7 may 2026' },
  ],
  'sab-002': [
    { author: 'Carolina Bermúdez', rating: 5, comment: 'El café latte es suave y cremoso, lo pido todas las mañanas.', date: '14 may 2026' },
    { author: 'Alejandro Duque', rating: 4, comment: 'Muy rico, la leche estaba perfectamente vaporizada.', date: '9 may 2026' },
  ],
  'sab-006': [
    { author: 'María Camila Palacio', rating: 5, comment: 'El granizado de café es perfecto para el calor del campus.', date: '12 may 2026' },
  ],
  'sab-007': [
    { author: 'Sebastián Castro', rating: 5, comment: 'El iced coffee está delicioso, muy refrescante.', date: '11 may 2026' },
    { author: 'Juliana Moreno', rating: 4, comment: 'Muy bueno, aunque a veces le falta un poco más de café.', date: '4 may 2026' },
  ],
  'sab-009': [
    { author: 'Miguel Ángel Torres', rating: 5, comment: 'El croissant de chocolate está recién horneado y delicioso.', date: '16 may 2026' },
    { author: 'Paula Londoño', rating: 4, comment: 'Muy bueno, el chocolate por dentro estaba generoso.', date: '8 may 2026' },
  ],
  'sab-010': [
    { author: 'Tomás Escobar', rating: 5, comment: 'El rollo de canela es espectacular, el glaseado es perfecto.', date: '10 may 2026' },
  ],
  'sab-014': [
    { author: 'Daniela Arboleda', rating: 4, comment: 'El sándwich de jamón y queso es clásico y bien hecho.', date: '13 may 2026' },
  ],
  'qui-001': [
    { author: 'Esteban Villa', rating: 5, comment: 'El café de origen Quindío es suave y muy aromático.', date: '15 may 2026' },
    { author: 'Mariana Pino', rating: 5, comment: 'Excelente café, se nota la calidad del grano colombiano.', date: '6 may 2026' },
  ],
  'qui-002': [
    { author: 'Valeria Garzón', rating: 5, comment: 'El cappuccino de Quindío es de los mejores que he tomado aquí.', date: '14 may 2026' },
    { author: 'Juan Pablo Echeverri', rating: 4, comment: 'Muy buena espuma, el café es de buena calidad.', date: '9 may 2026' },
  ],
  'qui-006': [
    { author: 'Camila Botero', rating: 5, comment: 'El frappé es muy cremoso y el café se siente bien fuerte.', date: '11 may 2026' },
  ],
  'qui-008': [
    { author: 'Andrés Bedoya', rating: 5, comment: 'La almojábana recién horneada con el café es la combinación perfecta.', date: '13 may 2026' },
    { author: 'Laura Aristizábal', rating: 4, comment: 'Siempre fresca y esponjosa, muy recomendada.', date: '5 may 2026' },
  ],
  'qui-009': [
    { author: 'Santiago Tobón', rating: 5, comment: 'El pandebono es el más fresco del campus, imperdible.', date: '16 may 2026' },
    { author: 'Isabella Upegui', rating: 4, comment: 'Muy bueno, aunque a veces se acaba rápido.', date: '7 may 2026' },
  ],
  'qba-001': [
    { author: 'Nicolás Rendón', rating: 5, comment: 'El cubano es espectacular, el cerdo muy suave y los pepinillos perfectos.', date: '14 may 2026' },
    { author: 'Sofía Osorio', rating: 5, comment: 'El mejor sándwich cubano que he comido en Cali, no exagero.', date: '8 may 2026' },
  ],
  'qba-002': [
    { author: 'Manuela Varela', rating: 4, comment: 'El sándwich de pollo es muy fresco, las salsas bien balanceadas.', date: '12 may 2026' },
    { author: 'Camilo Suárez', rating: 4, comment: 'Buena opción, el pollo estaba jugoso.', date: '3 may 2026' },
  ],
  'qba-005': [
    { author: 'Daniela Soto', rating: 4, comment: 'El wrap de pollo está muy rico, el ranch le queda perfecto.', date: '10 may 2026' },
  ],
  'qba-007': [
    { author: 'Felipe Henao', rating: 5, comment: 'El combo cubano es la mejor relación precio-calidad del campus.', date: '15 may 2026' },
    { author: 'Sara Gallego', rating: 4, comment: 'Muy completo, las papas fritas siempre crujientes.', date: '6 may 2026' },
  ],
  'snf-001': [
    { author: 'Valentín Agudelo', rating: 5, comment: 'La pizza T.Q.M es deliciosa, la tocineta y el queso son perfectos.', date: '13 may 2026' },
    { author: 'Natalia Holguín', rating: 4, comment: 'Muy buena pizza, el combo con bebida es conveniente.', date: '5 may 2026' },
  ],
  'snf-002': [
    { author: 'David Arbeláez', rating: 5, comment: 'El sándwich de pollo con champiñones es diferente y muy sabroso.', date: '11 may 2026' },
  ],
  'snf-004': [
    { author: 'Alejandra Ocampo', rating: 4, comment: 'La chuleta de cerdo estaba bien cocida, buen acompañante.', date: '9 may 2026' },
    { author: 'Tomás Cárdenas', rating: 4, comment: 'Buena porción para el precio, el arroz estaba en su punto.', date: '2 may 2026' },
  ],
  'snf-005': [
    { author: 'Luisa Quintero', rating: 5, comment: 'El filete de pollo estaba perfecto, muy jugoso y bien sazonado.', date: '16 may 2026' },
  ],
  'snf-008': [
    { author: 'Mateo Valencia', rating: 4, comment: 'El burrito de carne está muy completo, las salsas le quedan bien.', date: '14 may 2026' },
    { author: 'Carolina Posada', rating: 3, comment: 'Está bueno pero el arroz estaba un poco seco ese día.', date: '7 may 2026' },
  ],
  'snb-001': [
    { author: 'Andrés Muñoz', rating: 5, comment: 'La pizza T.Q.M está igual de buena que en el Edificio F.', date: '15 may 2026' },
    { author: 'Juliana Castaño', rating: 4, comment: 'Muy buena, me gusta que queda cerca de bienestar.', date: '8 may 2026' },
  ],
  'snb-002': [
    { author: 'Sebastián Giraldo', rating: 4, comment: 'El sándwich de pollo siempre está fresco, buena opción.', date: '12 may 2026' },
  ],
  'snb-003': [
    { author: 'María Fernanda Ríos', rating: 5, comment: 'El perro con queso y tocineta es imperdible, muy sabroso.', date: '10 may 2026' },
    { author: 'Camilo Jaramillo', rating: 4, comment: 'Muy rico, el queso derretido y la tocineta crujiente perfectos.', date: '4 may 2026' },
  ],
  'snb-009': [
    { author: 'Valeria Cano', rating: 4, comment: 'Los dedos de queso son crujientes y bien rellenos.', date: '13 may 2026' },
  ],
  'ven-001': [
    { author: 'Felipe Montoya', rating: 5, comment: 'Los huevos con salchicha más la almojábana es el desayuno perfecto.', date: '14 may 2026' },
    { author: 'Sara Naranjo', rating: 5, comment: 'Siempre fresco y bien preparado, el mejor desayuno del campus.', date: '9 may 2026' },
  ],
  'ven-002': [
    { author: 'Diego Toro', rating: 5, comment: 'Los huevos con tocineta crocante son espectaculares.', date: '11 may 2026' },
    { author: 'Daniela Reyes', rating: 4, comment: 'Muy bueno el desayuno, la arepa con queso incluida es un plus.', date: '6 may 2026' },
  ],
  'ven-003': [
    { author: 'Alejandro Sierra', rating: 5, comment: 'La pasta alfredo con pollo es cremosa y abundante, increíble.', date: '16 may 2026' },
    { author: 'Isabella Córdoba', rating: 5, comment: 'La mejor pasta del campus sin duda, el pollo perfecto.', date: '7 may 2026' },
  ],
  'ven-005': [
    { author: 'Nicolás Salcedo', rating: 5, comment: 'La pasta bolognesa tiene un sabor muy auténtico, excelente.', date: '13 may 2026' },
    { author: 'Manuela Bermúdez', rating: 4, comment: 'Muy rica, la salsa de carne estaba bien condimentada.', date: '5 may 2026' },
  ],
  'ven-007': [
    { author: 'Santiago Heredia', rating: 5, comment: 'La lasagna mixta es brutal, el queso gratinado perfecto.', date: '15 may 2026' },
    { author: 'Camila Acosta', rating: 4, comment: 'Muy sabrosa, buena porción para el precio.', date: '3 may 2026' },
  ],
  'ven-010': [
    { author: 'Tomás Vargas', rating: 5, comment: 'El cappuccino de Ventolini tiene una espuma perfecta, muy rico.', date: '12 may 2026' },
  ],
  'won-001': [
    { author: 'Laura Ospina', rating: 5, comment: 'El sándwich de pollo desmechado es mi favorito del Wonka.', date: '14 may 2026' },
    { author: 'Felipe Cardona', rating: 4, comment: 'Muy rico, el pollo desmechado bien sazonado.', date: '9 may 2026' },
  ],
  'won-002': [
    { author: 'María Alejandra Gómez', rating: 5, comment: 'La carne desmechada en el sándwich es increíble, muy sabrosa.', date: '11 may 2026' },
  ],
  'won-005': [
    { author: 'Andrés Betancourt', rating: 4, comment: 'El wrap de pollo es muy completo y las salsas están ricas.', date: '16 may 2026' },
    { author: 'Juliana Velásquez', rating: 4, comment: 'Buena opción para el almuerzo, siempre fresco.', date: '8 may 2026' },
  ],
  'won-008': [
    { author: 'Sebastián Palomino', rating: 5, comment: 'El maíz gratinado es una delicia, el queso derretido perfecto.', date: '13 may 2026' },
    { author: 'Carolina Ríos', rating: 5, comment: 'No había probado el maíz gratinado y ahora no puedo dejar de pedirlo.', date: '6 may 2026' },
  ],
  'won-009': [
    { author: 'Nicolás Caballero', rating: 4, comment: 'El desgranado de pollo es muy sabroso, buena porción.', date: '10 may 2026' },
  ],
  'won-010': [
    { author: 'Sofía Guerrero', rating: 4, comment: 'El perro grande es una buena opción rápida, todas las salsas.', date: '15 may 2026' },
    { author: 'Mateo Aristizábal', rating: 4, comment: 'Bueno para cuando tienes poco tiempo, siempre lo tienen listo.', date: '7 may 2026' },
  ],
}

export function getProductReviews(id: string): Review[] {
  return REVIEWS[id] ?? []
}
