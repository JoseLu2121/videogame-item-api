import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { User } from '../models/user.model';

export const authRoutes = new Elysia({ prefix: '/auth' }) 
  .use(
    jwt({
      name: 'jwt',
      secret: Bun.env.JWT_SECRET
    })
  )
  .get('', () => {
    return { mensaje: 'Auth working correctly' }
  })
  .post('/register', async ({ body, set }) => {
    const { email, password } = body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      set.status = 400;
      return { error: 'Email currently in database.' };
    }

    const hashedPassword = await Bun.password.hash(password);

    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    return { menssage: 'User created', id: newUser._id };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })

  .post('/login', async ({ body, jwt, set }) => {
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      set.status = 401;
      return { error: 'Invalid credentials' };
    }

    const isValid = await Bun.password.verify(password, user.password);
    if (!isValid) {
      set.status = 401;
      return { error: 'Invalid credentials' };
    }

    const token = await jwt.sign({ id: user._id });

    return { message: 'Login successfull', token };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  });