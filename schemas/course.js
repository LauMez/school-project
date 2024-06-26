import z from 'zod'

const courseSchema = z.object({
  year: z.number({
    invalid_type_error: 'Course year must be a number',
    required_error: 'Course year is required'
  }),
  division: z.number({
    invalid_type_error: 'Course division must be a number',
    required_error: 'Course division name is required'
  })
});

const courseGroupScheme = z.object({
  group: z.string({
    invalid_type_error: 'Course group must be a string',
    required_error: 'Course group name is required'
  })
});

export function validateGroup (input) {
  return courseGroupScheme.safeParse(input)
}

export function validatePartialGroup (input) {
  return courseGroupScheme.partial().safeParse(input)
}

export function validateCourse (input) {
  return courseSchema.safeParse(input)
}

export function validatePartialCourse (input) {
  return courseSchema.partial().safeParse(input)
}
