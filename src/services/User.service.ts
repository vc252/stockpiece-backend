import Container from "../container/Container.js";
import UserRepository from "../repositories/user.repositories.js";
import { CreateUserInput, UserResponse } from "../schemas/User.schema.js";
import { logger } from "../utils/logger.js";

export default class UserService {
  private readonly userRepository: UserRepository;

  constructor(Container: Container) {
    this.userRepository = Container.resolve<UserRepository>("userRepository");
  }

  public readonly registerUser = async (
    user: CreateUserInput
  ): Promise<UserResponse> => {
    const createdUser: UserResponse =
      await this.userRepository.createUser(user);
    logger.info(`user created: `, createdUser);
    return createdUser;
  };
}
