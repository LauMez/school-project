import z from 'zod'

const studentSchema = z.object({
  CUIL: z.string({
    invalid_type_error: 'Student CUIL must be a string',
    required_error: 'Student CUIL is required.'
  }),
  DNI: z.string({
    invalid_type_error: 'Student DNI must be a string',
    required_error: 'Student DNI is required'
  }),
  first_name: z.string({
    invalid_type_error: 'Student first name must be a string',
    required_error: 'Student first name is required'
  }),
  second_name: z.string({
    invalid_type_error: 'Student second name must be a string'
  }),
  last_name1: z.string({
    invalid_type_error: 'Student last name must be a string',
    required_error: 'Student last name is required'
  }),
  last_name2: z.string({
    invalid_type_error: 'Student last name must be a string'
  }),
  phone_number: z.string({
    invalid_type_error: 'Student phone number must be a string',
    required_error: 'Student phone number is required'
  }),
  landline_phone_number: z.string({
    invalid_type_error: 'Student landline phone number must be a string'
  }),
  direction: z.string({
    invalid_type_error: 'Student direction must be a string',
    required_error: 'Student direction is required'
  }),
  blood_type: z.string({
    invalid_type_error: 'Student blood type be a string',
    required_error: 'Student blood type is required'
  }),
  social_work: z.string({
    invalid_type_error: 'Student social work be a string'
  })
  // year: z.number().int().min(1900).max(2024),
  // director: z.string(),
  // duration: z.number().int().positive(),
  // rate: z.number().min(0).max(10).default(5),
  // poster: z.string().url({
  //   message: 'Poster must be a valid URL'
  // }),
  // genre: z.array(
  //   z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
  //   {
  //     required_error: 'Movie genre is required.',
  //     invalid_type_error: 'Movie genre must be an array of enum Genre'
  //   }
  // )
})

export function validateStudent (input) {
  return studentSchema.safeParse(input)
}

export function validatePartialStudent (input) {
  return studentSchema.partial().safeParse(input)
}
