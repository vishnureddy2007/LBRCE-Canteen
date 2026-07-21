FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Limit memory usage of maven compilation to fit within 512MB limit of Render builder
ENV MAVEN_OPTS="-XX:+UseSerialGC -Xmx400m -Xms256m"

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Enforce Jvm limits inside container so it fits in 512MB RAM
ENTRYPOINT ["java","-XX:+UseSerialGC","-Xmx350m","-Xms256m","-jar","app.jar"]
