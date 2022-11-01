#
# Copyright (c) 2022 Airbyte, Inc., all rights reserved.
#

from unittest.mock import MagicMock

from pytest import fixture, raises
from source_tplcentral.source import ConfigurationError, SourceTplcentral


@fixture
def config():
    return {
        "config": {
            "url_base": "https://secure-wms.com/",
            "client_id": "xxx",
            "client_secret": "yyy",
            "user_login_id": 123,
            "tpl_key": "{00000000-0000-0000-0000-000000000000}",
            "customer_id": 4,
            "facility_id": 5,
            "start_date": "2021-10-01",
        }
    }


@fixture
def http_config():
    return {
        "url_base": "http://secure-wms.com",
    }


def test_check_connection(mocker, requests_mock, config):
    source = SourceTplcentral()
    logger_mock = MagicMock()
    requests_mock.post(
        f"{config['config']['url_base']}AuthServer/api/Token",
        json={
            "access_token": "the_token",
            "token_type": "Bearer",
            "expires_in": 3600,
            "refresh_token": None,
            "scope": None,
        },
    )
    assert source.check_connection(logger_mock, **config) == (True, None)


def test_auth_raises_configuration_error(http_config):
    source = SourceTplcentral()
    with raises(ConfigurationError):
        source._auth(http_config)


def test_streams(mocker):
    source = SourceTplcentral()
    config_mock = MagicMock()
    streams = source.streams(config_mock)
    expected_streams_number = 6
    assert len(streams) == expected_streams_number
