from setuptools import setup, find_packages

setup(
    name="open-peer-power-frontend",
    version="20200000.1",
    description="The Open Peer Power frontend",
    url="https://github.com/open-peer-power/open-peer-power-polymer",
    author="The Open Peer Power Authors",
    author_email="hello@open-peer-power.io",
    license="Apache License 2.0",
    packages=find_packages(include=["opp_frontend", "opp_frontend.*"]),
    include_package_data=True,
    zip_safe=False,
)
