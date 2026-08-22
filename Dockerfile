FROM node:20-alpine AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-17 AS backend-build
WORKDIR /workspace/backend
COPY backend/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline
COPY backend/ ./
COPY --from=frontend-build /workspace/frontend/dist ./src/main/resources/static
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /workspace/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-XX:+UseSerialGC","-Xmx350m","-Xms128m","-jar","app.jar"]
