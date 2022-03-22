import { SinonStub, SinonSpy, fake, stub } from "sinon";
import { UserProfileStore } from "../../src/store/user-profiles";

type Init = typeof UserProfileStore.prototype.init;
type Get = typeof UserProfileStore.prototype.get;
type Set = typeof UserProfileStore.prototype.set;

export class StubUserProfileStore {
  fakeInit: SinonSpy<Parameters<Init>, ReturnType<Init>> = fake.resolves(null);
  fakeGet: SinonStub<Parameters<Get>, ReturnType<Get>>;
  fakeSet: SinonStub<Parameters<Set>, ReturnType<Set>>;

  withGet(
    args: Parameters<typeof this.fakeGet.withArgs>,
    resolves: Parameters<typeof this.fakeGet.resolves>[0]
  ): StubUserProfileStore {
    if (!this.fakeGet) {
      this.fakeGet = stub();
    }
    this.fakeGet.withArgs(...args).resolves(resolves);
    return this;
  }

  withSet(
    args: Parameters<typeof this.fakeSet.withArgs>,
    resolves: Parameters<typeof this.fakeSet.resolves>[0]
  ): StubUserProfileStore {
    if (!this.fakeSet) {
      this.fakeSet = stub();
    }
    this.fakeSet.withArgs(...args).resolves(resolves);
    return this;
  }

  build(): UserProfileStore {
    return (<Partial<UserProfileStore>>{
      init: this.fakeInit,
      get: this.fakeGet,
      set: this.fakeSet,
    }) as UserProfileStore;
  }
}
