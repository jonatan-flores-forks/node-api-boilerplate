import { CreateArticle, makeCreateArticle } from "@/article/application/CreateArticle";
import { DeleteArticle, makeDeleteArticle } from "@/article/application/DeleteArticle";
import { makePublishArticle, PublishArticle } from "@/article/application/PublishArticle";
import { ArticleRepository } from "@/article/domain/ArticleRepository";
import { ArticleCollection, initArticleCollection } from "@/article/infrastructure/ArticleCollection";
import { makeMongoArticleRepository } from "@/article/infrastructure/MongoArticleRepository";
import { makeArticleController } from "@/article/presentation/articleController";
import { FindArticles } from "@/article/query/FindArticles";
import { initFunction } from "@/_lib/AppInitializer";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { toContainerValues } from "@/_lib/wrappers/toContainerFunctions";
import { asFunction } from "awilix";
import { makeMongoFindArticles } from "@/article/query/impl/MongoFindArticles";

const articleModule = initFunction(async ({ register, build }) => {
  const collections = await build(
    withMongoProvider({
      articleCollection: initArticleCollection,
    })
  );

  register({
    ...toContainerValues(collections),
    articleRepository: asFunction(makeMongoArticleRepository),
    createArticle: asFunction(makeCreateArticle),
    publishArticle: asFunction(makePublishArticle),
    deleteArticle: asFunction(makeDeleteArticle),
    findArticles: asFunction(makeMongoFindArticles),
  });

  build(makeArticleController);
});

type Container = {
  articleCollection: ArticleCollection;
  articleRepository: ArticleRepository;
  createArticle: CreateArticle;
  publishArticle: PublishArticle;
  deleteArticle: DeleteArticle;
  findArticles: FindArticles;
};

export { articleModule, Container };
