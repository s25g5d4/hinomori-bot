import { Logger } from "pino";
import { status } from "@grpc/grpc-js";
import { Tag } from "src/models/tag";
import { logger } from "src/logger";
import { FirebaseDB } from "./db";

export class EmptyNameError extends Error {
  constructor() {
    super("name is empty");
  }
}

export class EmptyUserError extends Error {
  constructor() {
    super("user is empty");
  }
}

export class UserNotMatchError extends Error {
  constructor() {
    super("user does not match");
  }
}

export class TagAlreadyExistsError extends Error {
  constructor() {
    super("tag already exists");
  }
}

export class TagNotFoundError extends Error {
  constructor() {
    super("tag not found");
  }
}

export class TagStore {
  private readonly guildCollectionName = "guilds";
  private readonly TagsCollectionName = "tags";

  private logger: Logger;

  constructor(private db: FirebaseDB) {
    this.logger = logger.child({ name: "store" });
  }

  async init(): Promise<void> {
    // noop
  }

  private tagDoc(guild: string, name: string) {
    return this.db.db
      .collection(this.guildCollectionName)
      .doc(guild)
      .collection(this.TagsCollectionName)
      .doc(name);
  }

  async get(guild: string, name: string): Promise<Tag | null> {
    if (!name) {
      throw new EmptyNameError();
    }

    const l = this.logger.child({ options: { guild, name } });
    l.debug("get tag");
    const doc = await this.tagDoc(guild, name).get();
    if (!doc.exists) {
      l.info("tag not found");
      return null;
    }
    logger.info("tag retrieved");
    return doc.data() as Tag;
  }

  async create(guild: string, tag: Tag): Promise<void> {
    if (!tag.name) {
      throw new EmptyNameError();
    }
    if (!tag.user) {
      throw new EmptyUserError();
    }

    const l = this.logger.child({
      options: { guild, name: tag.name, user: tag.user },
    });

    l.debug("create tag");
    try {
      await this.tagDoc(guild, tag.name).create(tag);
    } catch (err) {
      if (err.code === status.ALREADY_EXISTS) {
        throw new TagAlreadyExistsError();
      }
      throw err;
    }
    l.info("tag created");
  }

  async update(guild: string, tag: Tag): Promise<void> {
    if (!tag.name) {
      throw new EmptyNameError();
    }
    if (!tag.user) {
      throw new EmptyUserError();
    }

    const l = this.logger.child({
      options: { guild, name: tag.name, user: tag.user },
    });

    l.debug("update tag");
    await this.db.db.runTransaction(async (tx) => {
      const existingTagDoc = await tx.get(this.tagDoc(guild, tag.name));
      if (existingTagDoc.exists) {
        const existingTag = existingTagDoc.data() as Tag;
        if (existingTag.user !== tag.user) {
          l.error("new tag's user does not match the existing tag's");
          throw new UserNotMatchError();
        }
      }

      tx.set(this.tagDoc(guild, tag.name), tag);
    });

    l.info("tag updated");
  }

  async remove(guild: string, user: string, name: string): Promise<void> {
    if (!name) {
      throw new EmptyNameError();
    }
    if (!user) {
      throw new EmptyUserError();
    }

    const l = this.logger.child({ options: { guild, name: name, user: user } });

    l.debug("remove tag");
    await this.db.db.runTransaction(async (tx) => {
      const existingTagDoc = await tx.get(this.tagDoc(guild, name));
      if (existingTagDoc.exists) {
        const existingTag = existingTagDoc.data() as Tag;
        if (existingTag.user !== user) {
          l.error("new tag's user does not match the existing tag's");
          throw new UserNotMatchError();
        }
      } else {
        throw new TagNotFoundError();
      }

      tx.delete(this.tagDoc(guild, name));
    });

    l.info("tag removed");
  }
}
