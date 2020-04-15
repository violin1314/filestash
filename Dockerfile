FROM golang:1.13
MAINTAINER guanw@neusoft.com

WORKDIR /app

ENV GO111MODULE="auto"

COPY server/ /app/server
COPY dist/ /app/dist
COPY go.mod /app
COPY go.sum/ /app

RUN go build server/main.go && \
    cp -r dist/data data && \
    rm go.mod && \
    rm go.sum && \
    rm -rf server && \
    rm -rf dist

EXPOSE 8999
CMD ["/app/main"]
