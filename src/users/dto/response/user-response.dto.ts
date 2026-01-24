import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from '../../entities/user.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  @Transform(({ obj }: { obj: User }) => obj._id?.toString())
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName?: string;

  // @Expose()
  // get fullName(): string {
  //   return [this?.firstName, this?.lastName].filter(Boolean).join('+++');
  // }
  //   @Expose()
  //   @Transform(({ obj }: { obj: User }) => {
  //     return [obj.firstName, obj?.lastName].filter(Boolean).join(' ');
  //   })
  //   fullName: string;
}
