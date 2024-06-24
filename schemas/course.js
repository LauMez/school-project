import z from 'zod'

const courseSchema = z.object({
  year: z.number({
    invalid_type_error: 'Course year must be a number',
    required_error: 'Course year is required'
  }),
  division: z.number({
    invalid_type_error: 'Course division must be a number',
    required_error: 'Course division name is required'
  }),
  group: z.string({
    invalid_type_error: 'Course group must be a string',
    required_error: 'Course group name is required'
  })
})

export function validateCourse (input) {
  return courseSchema.safeParse(input)
}

export function validatePartialCourse (input) {
  return courseSchema.partial().safeParse(input)
}
