import contextlib
import psycopg2
from abc import ABCMeta, abstractmethod
from typing import Generic, TypeVar
import os

import attr
import flask
from option import Result

from core.gql.graphql_controller import GraphqlController
from core.gql.graphql_request import parse_graphql_request

Context = TypeVar("Context")


@attr.s(slots=True, auto_attribs=True)
class App(Generic[Context], metaclass=ABCMeta):
    flask_app: flask.Flask
    graphql_controller: GraphqlController[Context]
    database_path: str

    def __attrs_post_init__(self):
        self.setup_routes()

    def setup_routes(self):
        @self.flask_app.route("/graphql", methods=["GET", "POST"])
        def graphql():
            with contextlib.closing(
                psycopg2.connect(
                    host=os.getenv("POSTGRES_DBHOST"),
                    dbname=os.getenv("POSTGRES_DBNAME"),
                    user=os.getenv("POSTGRES_USER"),
                    password=os.getenv("POSTGRES_PASSWORD"),
                )
            ) as conn:
                flask.g.connection = conn
                result = self.execute_gql(flask.request)
                if result.is_err:
                    response = flask.jsonify(result.unwrap_err())
                    response.status_code = 400
                else:
                    response = flask.jsonify(result.unwrap())
                return response

        @self.flask_app.route("/")
        def home():
            return "Hello"

    @abstractmethod
    def create_context(self, request: flask.Request) -> Context:
        ...

    def execute_gql(self, request: flask.Request) -> Result[dict, dict]:
        if request.method == "POST":
            gql_request = parse_graphql_request(request)
            context = self.create_context(request)
            return gql_request.map_err(lambda e: {"errors": [e]}).flatmap(
                lambda req: self.graphql_controller.execute(req, context)
            )
        else:
            return self.graphql_controller.introspect()
