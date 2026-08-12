import pytest
from app.core.resources import load_domain_resources
from app.domain.enums.poetry_form import PoetryForm
from app.domain.rules.validators import PoetryValidator

@pytest.fixture(scope="module")
def validator() -> PoetryValidator:
    return PoetryValidator(load_domain_resources())

def test_luc_bat_validator_valid(validator):
    lines = [
        "Thân em như lúa đòng đòng",
        "Phất phơ dưới ngọn nắng hồng ban mai"
    ]
    passed, errors = validator.validate(PoetryForm.LUC_BAT, lines)
    assert passed is True
    assert len(errors) == 0

def test_luc_bat_validator_invalid(validator):
    lines = [
        "Thân em như lúa đòng đòng ơi",
        "Phất phơ dưới ngọn nắng hồng ban mai"
    ]
    passed, errors = validator.validate(PoetryForm.LUC_BAT, lines)
    assert passed is False
    assert len(errors) > 0

def test_tho_bay_chu_validator(validator):
    lines = [
        "Trời xanh cao thẳm mấy tầng khơi",
        "Nỡ để hoa tàn giữa tuổi xanh"
    ]
    passed, errors = validator.validate(PoetryForm.BAY_CHU, lines)
    assert passed is True